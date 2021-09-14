import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import ReactWordcloud from "react-wordcloud";

import db from "apis/dexie";
import { Dimmer, Dropdown, Grid, Header, Loader } from "semantic-ui-react";
import { useLiveQuery } from "dexie-react-hooks";

const wordcloudOptions = {
  rotations: 0,
  enableOptimizations: true,
  enableTooltip: false,
  deterministic: true,
  fontFamily: "impact",
  fontSizes: [20, 60],
  transitionDuration: 500,
  colors: ["white"],
};
const wordcloudSize = undefined;

const propTypes = {
  /** The name of the table in db */
  table: PropTypes.string,
  /** The name of the field in db */
  field: PropTypes.string,
  /** An array with a selection of row ids in table */
  inSelection: PropTypes.array,
  /** An integer specifying the number of words in the cloud*/
  nWords: PropTypes.number,
  /** A boolean for whether data is loading */
  loading: PropTypes.bool,
  /** A callback for setting the selection state */
  setOutSelection: PropTypes.func,
};

/**
 * Makes a wordcloud for keys, for a given table:field in db
 */
const KeyCloud = ({ table, field, inSelection, nWords, loading, setOutSelection }) => {
  const [keys, setKeys] = useState(new Set([]));
  const [words, setWords] = useState([]);
  const [data, setData] = useState(null);
  const [loadingData, setLoadingData] = useState(false);

  const n = useLiveQuery(() => db.idb.table(table).count());

  useEffect(() => {
    prepareData(table, field, inSelection, setData, setLoadingData, setKeys);
  }, [table, field, inSelection, setData, n, setLoadingData, setKeys]);

  useEffect(() => {
    if (!data) {
      setWords([]);
      return null;
    }
    const words = data.keys.slice(0, nWords).map((word) => {
      const text = word.text.replace("www.", "");
      return { text: text, domain: word.text, value: word.value };
    });
    setWords(words);
  }, [data, nWords]);

  useEffect(() => {
    let ignore = false;
    const getSelection = async () => {
      let selection = keys.size > 0 ? await db.getSelectionAny(table, field, [...keys]) : null;
      if (!ignore) setOutSelection(selection);
    };
    getSelection();
    return () => {
      ignore = true; // use closure to 'cancel' promise. prevents delayed older requests from overwriting new
    };
  }, [keys, setOutSelection, table, field]);

  const callbacks = React.useCallback(() => {
    return {
      onWordClick: (word) => {
        setKeys((old) => {
          const newkeys = new Set([...old]);
          if (newkeys.has(word.domain)) {
            newkeys.delete(word.domain);
          } else {
            newkeys.add(word.domain);
          }
          return newkeys;
        });
      },
      getWordColor: (word) => {
        if (keys.size === 0) return "white";
        return keys.has(word.domain) ? "white" : "grey";
      },
    };
  }, [keys]);

  return (
    <Grid
      style={{
        height: "100%",
        width: "100%",
        background: "#ffffff00",
        border: "none",
        boxShadow: "none",
        paddingTop: "2em",
      }}
    >
      <Grid.Column width={12} style={{ padding: "0", margin: "0" }}>
        <Dimmer active={loading || loadingData}>
          <Loader />
        </Dimmer>
        <Header as="h1" align={"center"} style={{ color: "white", padding: "0", margin: "0" }}>
          Top {nWords} {field}s
        </Header>
        <div style={{ overflow: "auto" }}>
          <div style={{ height: "400px", minWidth: "800px" }}>
            <ReactWordcloud
              words={words}
              minSize={wordcloudSize}
              callbacks={callbacks()}
              options={wordcloudOptions}
            />
          </div>
        </div>
      </Grid.Column>
      <Grid.Column width={4}>
        <Header style={{ color: "white" }}>{field.toUpperCase()} FILTER</Header>
        <p style={{ fontStyle: "italic", color: "white" }}>
          Filter on {field} by adding them below or clicking on the wordcloud
        </p>
        <Dropdown
          fluid
          multiple
          selection
          clearable
          search
          style={{
            width: "100%",
            color: "white",
            minHeight: "22em",
            background: "#ffffff21",
          }}
          value={[...keys]}
          onChange={(e, d) => setKeys(new Set(d.value))}
          options={
            data
              ? data.uniqueKeys.map((e) => ({
                  value: e,
                  text: e.replace("www.", ""),
                  key: e,
                }))
              : []
          }
        />
      </Grid.Column>
    </Grid>
  );
};

const prepareData = async (table, field, selection, setData, setLoadingData, setKeys) => {
  setLoadingData(true);

  let keyTotalObj = {};

  let t = await db.idb.table(table);

  let uniqueKeys = await t.orderBy(field).uniqueKeys();

  let collection =
    selection === null ? await t.toCollection() : await t.where("id").anyOf(selection);

  await collection.each((url) => {
    let keys = Array.isArray(url[field]) ? url[field] : [url[field]];
    for (let key of keys) {
      if (key !== "") {
        keyTotalObj[key] = (keyTotalObj[key] || 0) + 1;
      }
    }
  });
  let keyTotal = Object.keys(keyTotalObj).map((key) => {
    return { text: key, value: keyTotalObj[key] };
  });
  keyTotal.sort((a, b) => b.value - a.value); // sort from high to low value
  setData({ keys: keyTotal, uniqueKeys: uniqueKeys });
  setLoadingData(false);

  setKeys((keys) => new Set([...keys].filter((key) => keyTotalObj[key] != null)));
};

KeyCloud.propTypes = propTypes;
export default React.memo(KeyCloud);
