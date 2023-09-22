import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
import Wordcloud from "./dashboards/dashboardParts/Wordcloud";
import { List } from "semantic-ui-react";

const GROUP = "channel";
const SEARCHON = ["channel", "title"];
const COLUMNS = ["channel", "title", "date"];

/**
 * A dashboard for the youtube history data.
 * Note that this component is reached via the react router.
 */
export default function Youtube() {
  return (
    <DashboardTemplate
      dataName="Youtube"
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
  const top_queries_label = `channel${top_queries.length === 1 ? "" : "s"}`;
  const top_queries_list = (
    <List>
      {top_queries.map((mv) => {
        return (
          <List.Item key={mv.key}>
            <List.Content style={{ color: "white" }}>{`${mv.key.replace(/www[^.]*\./, "")} (${
              mv.count
            })`}</List.Content>
          </List.Item>
        );
      })}
    </List>
  );

  return [
    { statistic: "Total", field: "views", value: searches },
    { statistic: "Top", field: top_queries_label, value: top_queries_list },
  ];
};
