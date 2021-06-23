import React, { useEffect, useState } from "react";
import ReactWordcloud from "react-wordcloud";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataTable from "./DataTable";
import db from "../apis/dexie";
import { Dimmer, Grid, Loader, Segment } from "semantic-ui-react";
import SearchInput from "./SearchInput";

const SEARCHON = ["url", "title"];

const BrowsingHistory = () => {
  const [data, setData] = useState({});
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    prepareData(db, selection, setData);
  }, [selection, setData]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid.Column>
        <Grid.Row>
          <Grid.Column>
            <SearchInput
              table={"browsing_history"}
              searchOn={SEARCHON}
              selection={selection}
              setSelection={setSelection}
            />
          </Grid.Column>
          <Grid.Column>
            <DataTable
              table={"browsing_history"}
              columns={[
                { name: "domain", width: 2 },
                { name: "url", width: 3 },
                { name: "date", width: 2 },
                { name: "title", width: 6 },
              ]}
              selection={selection}
              allColumns={false}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <DomainCloud data={data} nWords={50} />
        </Grid.Row>
      </Grid.Column>
    </ColoredBackgroundGrid>
  );
};

const DomainCloud = ({ data, nWords }) => {
  const callbacks = {
    onWordClick: (word) => console.log(word),
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
  setData({ domainTotal });
};

export default BrowsingHistory;
