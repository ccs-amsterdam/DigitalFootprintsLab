import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
import Wordcloud from "./dashboards/dashboardParts/Wordcloud";
import { List } from "semantic-ui-react";

const GROUP = "word";
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
  if (!dashData) return null;
  return (
    <div style={{ width: "20vw", height: "vh" }}>
      <Wordcloud
        dashData={dashData}
        group={GROUP}
        inSelection={inSelection}
        setOutSelection={setOutSelection}
      />
    </div>
  );
};

const calcStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(GROUP, selection, " ");

  let searches = dashData.N(selection);
  let top_queries = [];
  const n_top_queries = 5;

  for (let key of Object.keys(counts)) {
    let insert = top_queries.findIndex((mv) => mv.count < counts[key]);
    if (insert < 0) insert = top_queries.length;
    if (insert < n_top_queries) {
      const value = { key, count: counts[key] };
      top_queries.splice(insert, 0, value);
    }
  }

  top_queries = top_queries.slice(0, n_top_queries);
  top_queries = (
    <List>
      {top_queries.map((mv) => {
        return (
          <List.Item>
            <List.Content>{`${mv.key.replace(/www[^.]*\./, "")} (${mv.count})`}</List.Content>
          </List.Item>
        );
      })}
    </List>
  );

  return [
    { label: "Total searches", value: searches },
    { label: "Top queries", value: top_queries },
  ];
};
