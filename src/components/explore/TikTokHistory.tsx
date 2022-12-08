import DashboardTemplate from "./dashboards/DashboardTemplate";
import Wordcloud from "./dashboards/dashboardParts/Wordcloud";

const GROUP = "_source";
const SEARCHON = ["_source"];
const COLUMNS = ["_source", "Date", "Link", "UserName", "SearchTerm", "_RAW_DATA"];

/**
 * A dashboard for the TikTok history data.
 * Note that this component is reached via the react router.
 */
export default function TikTok() {
  return (
    <DashboardTemplate
      dataName="TikTok"
      searchOn={SEARCHON}
      columns={COLUMNS}
      VisComponent={VisComponent}
      calcStatistics={calcStatistics}
    />
  );
}

const VisComponent = ({ dashData, inSelection, outSelection, setOutSelection }) => {
  if (!dashData) return null;
  return (
    <Wordcloud
      dashData={dashData}
      group={GROUP}
      inSelection={inSelection}
      outSelection={outSelection}
      setOutSelection={setOutSelection}
    />
  );
};

const calcStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(GROUP, selection, " ");
  console.log(dashData);
  const searches = dashData.N(selection);
  let top_queries = [];
  const n_top_queries = 5;

  for (const key of Object.keys(counts)) {
    let insert = top_queries.findIndex((mv) => mv.count < counts[key]);
    if (insert < 0) insert = top_queries.length;
    if (insert < n_top_queries) {
      const value = { key, count: counts[key] };
      top_queries.splice(insert, 0, value);
    }
  }

  top_queries = top_queries.slice(0, n_top_queries);

  return [{ statistic: "Total", field: "items", value: searches }];
};
