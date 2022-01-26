import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import intersect from "util/intersect";

import DashboardTemplate from "./dashboards/DashboardTemplate";
import useDashboardData from "./dashboardData/useDashboardData";
import KeyCloud from "./dashboards/dashboardParts/KeyCloud";

const propTypes = {
  /** The name of the type of data to explore. */
  dataName: PropTypes.string.isRequired,
  /** an Array indicating which fields in table should be used in the fulltext search */
  searchOn: PropTypes.array.isRequired,
  /** an array that conveys which fields in the table are shown in the DataTable. See DataTable for details */
  columns: PropTypes.array.isRequired,
};

const SEARCHON = ["url", "title"];
const COLUMNS = ["date", "title", "url"];

/**
 * A dashboard for the browsing history data.
 * Note that this component is reached via the react router.
 * When the card on the home page is clicked, it navigates to /Browsing_history
 */
const BrowsingHistory = () => {
  const dashData = useDashboardData("Browsing_history");
  const [statistics, setStatistics] = useState([]);
  const [altSelection, setAltSelection] = useState(null);
  const [querySelection, setQuerySelection] = useState(null);
  const [selection, setSelection] = useState(null);

  useEffect(() => {
    setSelection(intersect([querySelection, "domain", altSelection]));
  }, [querySelection, altSelection]);

  useEffect(() => {
    setStatistics(getStatistics(dashData, selection));
  }, [dashData, selection]);

  return (
    <DashboardTemplate
      dashData={dashData}
      searchOn={SEARCHON}
      columns={COLUMNS}
      querySelection={querySelection}
      setQuerySelection={setQuerySelection}
      altSelection={altSelection}
      statistics={statistics}
    >
      <KeyCloud
        dashData={dashData}
        field={"domain"}
        inSelection={querySelection}
        nWords={50}
        setOutSelection={setAltSelection}
      />
    </DashboardTemplate>
  );
};

const getStatistics = (dashData, field, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(field, selection);

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

BrowsingHistory.propTypes = propTypes;
export default BrowsingHistory;
