import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataTable from "./DataTable";
import DataList from "./DataList";
import db from "../apis/dexie";
import { Dimmer, Dropdown, Grid, Loader, Segment } from "semantic-ui-react";
import QueryTable from "./QueryTable";
import { useLiveQuery } from "dexie-react-hooks";
// import intersect from "../util/intersect";

const gridStyle = { paddingTop: "2em" };
const gridColumnStyle = { paddingLeft: "2em", paddingRight: "1em", overflow: "hidden" };

const SEARCHON = ["url", "title"];

const LAYOUT = {
  domain: { type: "header", style: { color: "white" } },
  url: { type: "meta", style: { color: "white" } },
  title: { type: "description", style: { color: "white" } },
  date: { type: "extra", style: { color: "white" } },
};

//https://nivo.rocks/calendar/
//https://github.com/motiz88/react-dygraphs#readme
//https://nivo.rocks/heatmap/   maybe for weekday by time

const BrowsingHistory = () => {
  const [data, setData] = useState({});
  const [querySelection, setQuerySelection] = useState(null);
  const [domainSelection, setDomainSelection] = useState([]);

  console.log(domainSelection);
  useEffect(() => {
    prepareData(db, querySelection, setData);
  }, [querySelection, setData]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid divided={"vertically"} style={gridStyle}>
        <Grid.Column width={5} style={gridColumnStyle}>
          <QueryTable
            table={"browsing_history"}
            searchOn={SEARCHON}
            setSelection={setQuerySelection}
          />
          <DataList table={"browsing_history"} layout={LAYOUT} selection={querySelection} />
        </Grid.Column>
        <Grid.Column width={11} style={gridColumnStyle}>
          <Grid.Row>
            <DomainCloud data={data} nWords={50} />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const LookupTable = ({ table, searchOn, setSelection }) => {
  const [selected, setSelected] = useState([]);
  const data = useLiveQuery(() => {
    return db.idb
      .table(table)
      .orderBy(searchOn)
      .uniqueKeys();
  });
  if (!data) return null;

  return (
    <Dropdown
      search
      clearable
      selection
      multiple={true}
      options={data.map(d => ({
        key: d,
        text: d,
        value: d,
      }))}
      value={selected}
      onChange={(e, d) => {
        setSelected(d.value);
        setSelection(d.value);
      }}
      style={{ minWidth: "25em", fontSize: "10px" }}
    />
  );
};

const DomainCloud = ({ data, nWords }) => {
  const callbacks = {
    onWordClick: word => alert(word.text),
    onWordMouseOver: console.log,
  };

  const options = {
    rotations: 0,
    enableTooltip: false,
    padding: 0.3,
    deterministic: true,
    fontFamily: "impact",
    fontSizes: [15, 100],
    transitionDuration: 500,
    colors: ["white"],
  };

  return (
    <Segment style={{ width: "80%", background: "#ffffff00" }}>
      <Dimmer active={!data.domainTotal}>
        <Loader />
      </Dimmer>
      <ReactWordcloud
        words={data.domainTotal ? data.domainTotal.slice(0, nWords) : []}
        callbacks={callbacks}
        options={options}
      />
    </Segment>
  );
};

const prepareData = async (db, selection, setData) => {
  let domainTotalObj = {};
  let hourTotal = new Array(24).fill(0);

  let table = await db.idb.browsing_history;

  let uniqueDomains = await table.orderBy("domain").uniqueKeys();

  let collection =
    selection === null ? await table.toCollection() : await table.where("id").anyOf(selection);

  await collection.each(url => {
    if (url.domain !== "") {
      domainTotalObj[url.domain] = (domainTotalObj[url.domain] || 0) + 1;
    }
    const hour = url.date.getHours();
    hourTotal[hour]++;
  });
  let domainTotal = Object.keys(domainTotalObj).map(domain => {
    return { text: domain, value: domainTotalObj[domain] };
  });
  domainTotal.sort((a, b) => b.value - a.value); // sort from high to low value
  setData({ domainTotal, uniqueDomains });
};

export default BrowsingHistory;
