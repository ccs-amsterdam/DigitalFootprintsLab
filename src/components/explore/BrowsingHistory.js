import React from "react";
import HistoryDashboard from "./dashboards/HistoryDashboard";

const SEARCHON = ["url", "title"];

const LAYOUT = ["date", "title", "url"];
// const LAYOUT = {
//   url: { type: "header", style: { color: "white" } },
//   title: { type: "description", style: { color: "white" } },
//   date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
// };

/**
 * Renders a HistoryDashboard for the browsing history data.
 * Note that this component is reached via the react router.
 * When the card on the home page is clicked, it navigates to /browsinghistory
 */
const BrowsingHistory = () => {
  return (
    <HistoryDashboard
      searchOn={SEARCHON}
      columns={LAYOUT}
      table={"browsinghistory"}
      cloudKey={"domain"}
    />
  );
};

export default BrowsingHistory;
