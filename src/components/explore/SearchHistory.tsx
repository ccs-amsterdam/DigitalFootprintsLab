import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
import Wordcloud from "./dashboards/dashboardParts/Wordcloud";
import { List } from "semantic-ui-react";

const GROUP = "words";
const SEARCHON = ["query"];
const COLUMNS = ["query", "_source", "date"];

/**
 * A dashboard for the search history data.
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
  if (!dashData) return null;
  return (
    <Wordcloud
      dashData={dashData}
      group={GROUP}
      inSelection={inSelection}
      setOutSelection={setOutSelection}
    />
  );
};

const calcStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(GROUP, selection, " ");

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
  const top_queries_list = (
    <List>
      {top_queries.map((mv) => {
        return (
          <List.Item key={mv.key}>
            <List.Content>{`${mv.key.replace(/www[^.]*\./, "")} (${mv.count})`}</List.Content>
          </List.Item>
        );
      })}
    </List>
  );

  return [
    { statistic: "Total", field: "searches", value: searches },
    { statistic: "Top", field: "queries", value: top_queries_list },
  ];
};
