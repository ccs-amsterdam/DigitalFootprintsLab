import React, { useState } from "react";
import ReactWordcloud from "react-wordcloud";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import { useLiveQuery } from "dexie-react-hooks";
import DataTable from "./DataTable";
import db from "../apis/dexie";
import { Grid } from "semantic-ui-react";

const BrowsingHistory = () => {
  const [data, setData] = useState({});

  useLiveQuery(async () => {
    let domainTotalObj = {};
    let hourTotal = new Array(24).fill(0);
    //let hourTopDomainObj = {};
    await db.idb.browsing_history.toCollection().each((url) => {
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
  });
  console.log(data);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid.Column>
        <DomainCloud data={data} />
        <DataTable
          table={"browsing_history"}
          columns={["domain", "url", "date", "title"]}
          widths={[2, 3, 2, 6]}
        />
      </Grid.Column>
    </ColoredBackgroundGrid>
  );
};

const DomainCloud = ({ data }) => {
  if (!data.domainTotal || data.domainTotal.length === 0) return null;

  const callbacks = {
    onWordClick: (word) => console.log(word),
    onWordMouseOver: console.log,
  };

  const options = {
    rotations: 0,
    enableTooltip: false,
    padding: 0.3,
    fontFamily: "impact",
    fontSizes: [15, 100],
    transitionDuration: 500,
    colors: ["white"],
  };
  const size = [600, 400];

  return (
    <ReactWordcloud
      words={data.domainTotal.slice(0, 50)}
      callbacks={callbacks}
      options={options}
      size={size}
    />
  );
};

export default BrowsingHistory;
