import React from "react";
import HistoryDashboard from "./dashboards/HistoryDashboard";

const SEARCHON = ["channel", "title"];

const LAYOUT = {
  channel: { type: "header", style: { color: "white" } },
  title: { type: "description", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

/**
 * Renders a HistoryDashboard for the youtube history data.
 * Note that this component is reached via the react router.
 * When the card on the home page is clicked, it navigates to /youtube
 */
const YoutubeHistory = () => {
  return (
    <HistoryDashboard searchOn={SEARCHON} layout={LAYOUT} table={"youtube"} cloudKey={"channel"} />
  );
};

export default YoutubeHistory;
