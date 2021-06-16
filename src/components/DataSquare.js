import React, { useState } from "react";
import { Card, Grid } from "semantic-ui-react";
import logo from "../images/logo.png";

import GoogleTakeout from "./platforms/GoogleTakeout";
import Youtube from "./platforms/Youtube_deprecated";

import ReactWordCloud from "react-wordcloud";
import { useLiveQuery } from "dexie-react-hooks";
import db from "../apis/dexie";

const DataSquare = () => {
  return (
    <div style={{ height: "100vh", backgroundImage: `url(${logo})`, backgroundSize: "100% 100%" }}>
      <Grid>
        <Grid.Column width={4}>
          <Card.Group style={{ paddingTop: "2em", paddingLeft: "2em" }}>
            <GoogleTakeout />
            <Youtube />
          </Card.Group>
        </Grid.Column>
        <Grid.Column width={12}>
          <UrlVisualization />
        </Grid.Column>
      </Grid>
    </div>
  );
};

const UrlVisualization = () => {
  const [data, setData] = useState({});

  useLiveQuery(async () => {
    let domainTotal = {};
    //let hourTotal = {};
    //let hourTopDomain = {};
    await db.idb.urls.orderBy("domain").eachKey((domain) => {
      if (domain !== "") {
        domainTotal[domain] = (domainTotal[domain] || 0) + 1;
      }
    });

    const newdata = {};
    newdata["domainTotal"] = Object.keys(domainTotal).map((domain) => {
      return { text: domain, value: domainTotal[domain] };
    });

    setData(newdata);
  });

  if (!data) return null;

  return (
    <ReactWordCloud
      words={data.domainTotal}
      options={{
        rotations: 0,
        padding: 0.5,
        fontSizes: [10, 100],
        deterministic: true,
        transitionDuration: 500,
        colors: ["white"],
      }}
    />
  );
};

export default DataSquare;
