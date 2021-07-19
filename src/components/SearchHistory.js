import React from "react";
import History from "./History";

const SEARCHON = ["url", "title"];

const LAYOUT = {
  query: { type: "header", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

const BrowsingHistory = () => {
  return <History searchOn={SEARCHON} layout={LAYOUT} table={"searchhistory"} cloudKey={"word"} />;
};

export default BrowsingHistory;
