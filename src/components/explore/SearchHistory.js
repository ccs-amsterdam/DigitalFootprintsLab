import React from "react";
import HistoryDashboard from "./dashboards/HistoryDashboard";

const SEARCHON = ["word"];
const columns = ["query", "date"];

/**
 * Renders a HistoryDashboard for the google search data.
 * Note that this component is reached via the react router.
 * When the card on the home page is clicked, it navigates to /searchhistory
 */
const SearchHistory = () => {
  return (
    <HistoryDashboard
      searchOn={SEARCHON}
      columns={columns}
      table={"searchhistory"}
      cloudKey={"word"}
    />
  );
};

export default SearchHistory;
