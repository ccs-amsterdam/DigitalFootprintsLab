import React from "react";
import HistoryDashboard from "./dashboards/HistoryDashboard";

const SEARCHON = ["word"];

const LAYOUT = {
  query: { type: "header", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

/**
 * Renders a HistoryDashboard for the google search data.
 * Note that this component is reached via the react router.
 * When the card on the home page is clicked, it navigates to /searchhistory
 */
const SearchHistory = () => {
  return (
    <HistoryDashboard
      searchOn={SEARCHON}
      layout={LAYOUT}
      table={"searchhistory"}
      cloudKey={"word"}
    />
  );
};

export default SearchHistory;
