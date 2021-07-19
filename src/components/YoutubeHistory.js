import React from "react";
import History from "./History";

const SEARCHON = ["channel", "title"];

const LAYOUT = {
  channel: { type: "header", style: { color: "white" } },
  title: { type: "description", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

const YoutubeHistory = () => {
  return <History searchOn={SEARCHON} layout={LAYOUT} table={"youtube"} cloudKey={"channel"} />;
};

export default YoutubeHistory;
