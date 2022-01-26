import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

import KeyCloud from "./dashboardParts/KeyCloud";
import useDashboardData from "../dashboardData/useDashboardData";
import DashboardTemplate from "./DashboardTemplate";

const propTypes = {
  /** The name of the type of data to explore. */
  dataName: PropTypes.string.isRequired,
  /** an Array indicating which fields in table should be used in the fulltext search */
  searchOn: PropTypes.array.isRequired,
  /** an array that conveys which fields in the table are shown in the DataTable. See DataTable for details */
  columns: PropTypes.array.isRequired,
};

/**
 * Renders a dashboard page with components for browsing and visualizing history data
 */
const HistoryDashboard = ({ dataName, searchOn, columns }) => {
  // const dashData = useDashboardData(dataName);
  // const [altSelection, setAltSelection] = useState(null);
  // const [querySelection, setQuerySelection] = useState(null);
  // useEffect(() => {
  //   setStatistics(getStatistics(dashData, selection));
  // }, [dashData, selection]);
  // return (
  //   <DashboardTemplate
  //     dashData={dashData}
  //     searchOn={searchOn}
  //     columns={columns}
  //     querySelection={querySelection}
  //     setQuerySelection={setQuerySelection}
  //     altSelection={altSelection}
  //     statistics={statistics}
  //   >
  //     <KeyCloud
  //       dashData={dashData}
  //       field={cloudKey}
  //       inSelection={querySelection}
  //       nWords={50}
  //       setOutSelection={setAltSelection}
  //     />
  //   </DashboardTemplate>
  // );
};

const getStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count("domain", selection);

  const stats = {};
  stats["Total visits"] = 0;
  stats["Most visited"] = ["none", 0]; // array of [0] key and [1] count
  stats["Unique websites"] = 0;
  for (let key of Object.keys(counts)) {
    stats["Total visits"] += counts[key];
    stats["Unique website"]++;
    if (counts[key] > stats["Most visited"][1]) stats["Most visited"] = [key, counts[key]];
  }

  return Object.keys(stats).map((label) => ({ label, value: stats[label] }));
};

HistoryDashboard.propTypes = propTypes;
export default HistoryDashboard;
