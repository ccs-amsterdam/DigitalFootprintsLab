import React, { useEffect, useState } from "react";
import ReactWordcloud, { defaultCallbacks } from "react-wordcloud";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataTable from "./DataTable";
import DataList from "./DataList";
import db from "../apis/dexie";
import { Dimmer, Dropdown, Grid, Header, Loader, Segment } from "semantic-ui-react";
import QueryTable from "./QueryTable";
import { useLiveQuery } from "dexie-react-hooks";
import intersect from "../util/intersect";

const gridStyle = { paddingTop: "0em", marginTop: "0em", height: "90vh" };
const gridColumnStyle = {
  paddingLeft: "2em",
  paddingRight: "1em",
  height: "100%",
};

const SEARCHON = ["url", "title"];

const LAYOUT = {
  url: { type: "header", style: { color: "white" } },
  title: { type: "description", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

//https://nivo.rocks/calendar/
//https://github.com/motiz88/react-dygraphs#readme
//https://nivo.rocks/heatmap/   maybe for weekday by time

// let querytable accept a preselection
// this can be any selection from indices (date, domain)

const BrowsingHistory = () => {
  const [data, setData] = useState({});
  const [querySelection, setQuerySelection] = useState(null);
  const [cloudSelection, setCloudSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    prepareData(db, querySelection, setData);
  }, [querySelection, setData]);

  useEffect(() => {
    setSelection(intersect([querySelection, cloudSelection]));
  }, [querySelection, cloudSelection]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid divided={"vertically"} style={gridStyle}>
        <Grid.Column width={4} style={{ ...gridColumnStyle }}>
          <Grid.Row centered style={{ padding: "2em" }}>
            <QueryTable
              table={"browsing_history"}
              searchOn={SEARCHON}
              setSelection={setQuerySelection}
              setLoading={setLoading}
            />
          </Grid.Row>
          <Grid.Row style={{ height: "90vh" }}>
            <DataList
              table={"browsing_history"}
              layout={LAYOUT}
              selection={selection}
              loading={loading}
            />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={12} style={{ padding: "0", paddingRight: "1em" }}>
          <Grid.Row style={{ overflow: "auto" }}>
            <DomainCloud
              table={"browsing_history"}
              field={"domain"}
              data={data}
              nWords={50}
              loading={loading}
              setSelection={setCloudSelection}
            />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const wordcloudOptions = {
  rotations: 0,
  enableTooltip: false,
  padding: 0.3,
  deterministic: true,
  fontFamily: "impact",
  fontSizes: [15, 50],
  transitionDuration: 100,
  colors: ["white"],
};

const getSelection = async (table, field, selected, setSelection) => {
  let selection = await db.getSelection(table, field, [...selected]);
  setSelection(selection);
};

const DomainCloud = React.memo(({ table, field, data, nWords, loading, setSelection }) => {
  const [selected, setSelected] = useState(new Set([]));
  const [words, setWords] = useState([]);

  useEffect(() => {
    console.log("test");
    if (!data.domainTotal) {
      setWords([]);
      return null;
    }
    const words = data.domainTotal.slice(0, nWords).map((word) => {
      const text = word.text.replace("www.", "");
      return { text: text, domain: word.text, value: word.value };
    });
    setWords(words);
  }, [data, nWords]);

  useEffect(() => {
    selected.size > 0 ? getSelection(table, field, selected, setSelection) : setSelection(null);
  }, [selected, setSelection, table, field]);

  const callbacks = React.useCallback(() => {
    return {
      onWordClick: (word) => {
        setSelected((old) => {
          const newselected = new Set([...old]);
          if (newselected.has(word.domain)) {
            newselected.delete(word.domain);
          } else {
            newselected.add(word.domain);
          }
          return newselected;
        });
      },
      getWordColor: (word) => {
        if (selected.size === 0) return "white";
        return selected.has(word.domain) ? "white" : "grey";
      },
    };
  }, [selected]);

  console.log("render");
  return (
    <Segment
      style={{
        width: "100%",
        background: "#ffffff00",
        border: "none",
        boxShadow: "none",
        paddingTop: "2em",
      }}
    >
      <Dropdown
        fluid
        multiple
        selection
        clearable
        value={[...selected]}
        onChange={(e, d) => setSelected(new Set(d.value))}
        options={
          data.domainTotal
            ? data.domainTotal.map((e) => ({ value: e.text, text: e.text, key: e.text }))
            : []
        }
      />

      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <ReactWordcloud words={words} callbacks={callbacks()} options={wordcloudOptions} />
    </Segment>
  );
});

const prepareData = async (db, selection, setData) => {
  let domainTotalObj = {};
  let hourTotal = new Array(24).fill(0);

  let table = await db.idb.browsing_history;

  let uniqueDomains = await table.orderBy("domain").uniqueKeys();

  let collection =
    selection === null ? await table.toCollection() : await table.where("id").anyOf(selection);

  await collection.each((url) => {
    if (url.domain !== "") {
      domainTotalObj[url.domain] = (domainTotalObj[url.domain] || 0) + 1;
    }
    const hour = url.date.getHours();
    hourTotal[hour]++;
  });
  let domainTotal = Object.keys(domainTotalObj).map((domain) => {
    return { text: domain, value: domainTotalObj[domain] };
  });
  domainTotal.sort((a, b) => b.value - a.value); // sort from high to low value
  console.log("test");
  setData({ domainTotal, uniqueDomains });
};

export default BrowsingHistory;
