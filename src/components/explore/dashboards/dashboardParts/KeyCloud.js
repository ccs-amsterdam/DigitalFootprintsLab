import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import ReactWordcloud from "react-wordcloud";

import { Dimmer, Dropdown, Grid, Header, Loader } from "semantic-ui-react";

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
const KeyCloud = ({ dashData, field, inSelection, nWords, setOutSelection }) => {
  const [keys, setKeys] = useState(new Set([]));
  const [words, setWords] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dashData) {
      setData(null);
      setKeys(new Set([]));
      return;
    }
    const counts = dashData.count(field, inSelection);
    let countsArray = Object.keys(counts).map((key) => {
      return { value: key, n: counts[key] };
    });
    countsArray.sort((a, b) => b.n - a.n); // sort from high to low value
    setData(countsArray);
    setKeys((keys) => new Set([...keys].filter((key) => counts[key] != null)));
  }, [dashData, inSelection, field, setData, setLoading, setKeys]);

  useEffect(() => {
    if (!data) {
      setWords([]);
      return null;
    }
    const words = data.slice(0, nWords).map((word) => {
      const text = word.value.replace("www.", "");
      return { text: text, key: word.value, value: word.n };
    });
    setWords(words);
  }, [data, nWords]);

  useEffect(() => {
    let ignore = false;
    const getSelection = async () => {
      let selection = keys.size > 0 ? await dashData.searchValues([...keys], field) : null;
      if (!ignore) setOutSelection(selection);
    };
    getSelection();
    return () => {
      ignore = true; // use closure to 'cancel' promise. prevents delayed older requests from overwriting new
    };
  }, [keys, setOutSelection, dashData, field]);

  const callbacks = React.useCallback(() => {
    return {
      onWordClick: (word) => {
        setKeys((old) => {
          const newkeys = new Set([...old]);
          if (newkeys.has(word.key)) {
            newkeys.delete(word.key);
          } else {
            newkeys.add(word.key);
          }
          return newkeys;
        });
      },
      getWordColor: (word) => {
        if (keys.size === 0) return "white";
        return keys.has(word.key) ? "white" : "grey";
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
        <Dimmer active={loading}>
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
              ? data.map((e) => ({
                  value: e.value,
                  text: e.value.replace("www.", ""),
                  key: e.value,
                }))
              : []
          }
        />
      </Grid.Column>
    </Grid>
  );
};

KeyCloud.propTypes = propTypes;
export default React.memo(KeyCloud);
