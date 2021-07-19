import React, { useEffect, useState } from "react";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataList from "./DataList";
import { Divider, Grid } from "semantic-ui-react";
import History from "./History";

import QueryTable from "./QueryTable";
import KeyCloud from "./KeyCloud";
import TimeLine from "./TimeLine";
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
  return (
    <History searchOn={SEARCHON} layout={LAYOUT} table={"browsinghistory"} cloudKey={"domain"} />
  );
};

export default BrowsingHistory;
