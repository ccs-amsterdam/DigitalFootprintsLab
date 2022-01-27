import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
import KeyCloud from "./dashboards/dashboardParts/KeyCloud";

const FIELD = "word";
const SEARCHON = ["word"];
const COLUMNS = ["query", "date"];

/**
 * A dashboard for the browsing history data.
 */
export default function SearchHistory() {
  return (
    <DashboardTemplate
      dataName="Search"
      searchOn={SEARCHON}
      columns={COLUMNS}
      VisComponent={VisComponent}
      calcStatistics={calcStatistics}
    />
  );
}

const VisComponent = ({ dashData, inSelection, setOutSelection }) => {
  return (
    <KeyCloud
      dashData={dashData}
      field={FIELD}
      inSelection={inSelection}
      nWords={50}
      setOutSelection={setOutSelection}
    />
  );
};

const calcStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(FIELD, selection);

  const stats = {};
  stats["Total visits"] = 0;
  stats["Most visited"] = ["none", 0]; // array of [0] key and [1] count
  stats["Unique websites"] = 0;
  for (let key of Object.keys(counts)) {
    stats["Total visits"] += counts[key];
    stats["Unique websites"]++;
    if (counts[key] > stats["Most visited"][1]) stats["Most visited"] = [key, counts[key]];
  }

  return Object.keys(stats).map((label) => ({ label, value: stats[label] }));
};
