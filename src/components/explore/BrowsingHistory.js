import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
import CirclePack from "./dashboards/dashboardParts/CirclePack";
import { List, Image } from "semantic-ui-react";

const GROUP = "domain";
const SEARCHON = ["url", "title"];
const COLUMNS = ["date", "title", "url"];

/**
 * A dashboard for the browsing history data.
 * Note that this component is reached via the react router.
 */
export default function BrowsingHistory() {
  return (
    <DashboardTemplate
      dataName="Browsing"
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
    <div>
      <CirclePack
        dashData={dashData}
        group={GROUP}
        grouptype="domain"
        inSelection={inSelection}
        setOutSelection={setOutSelection}
      />
    </div>
  );
};

const calcStatistics = (dashData, selection) => {
  if (!dashData) return [];
  const counts = dashData.count(GROUP, selection);

  let total_visits = 0;
  let domains = 0;
  let top_domains = [];
  const n_top_domains = 5;

  for (let key of Object.keys(counts)) {
    total_visits += counts[key];
    domains++;

    // add top x (n_top_domains)
    let insert = top_domains.findIndex((mv) => mv.count < counts[key]);
    if (insert < 0) insert = top_domains.length;
    if (insert < n_top_domains) {
      const value = {
        key,
        count: counts[key],
        image: `https://icons.duckduckgo.com/ip3/${key}.ico`,
      };
      top_domains.splice(insert, 0, value);
    }
  }

  top_domains = top_domains.slice(0, n_top_domains);
  top_domains = (
    <List>
      {top_domains.map((mv) => {
        return (
          <List.Item key={mv.key}>
            <Image style={{ height: "20px", width: "20px" }} src={mv.image} />
            <List.Content>{`${mv.key.replace(/www[^.]*\./, "")} (${mv.count})`}</List.Content>
          </List.Item>
        );
      })}
    </List>
  );

  const top_domains_label = domains > 1 ? "Top domains" : "Domain";
  return [
    { label: "Visits", value: total_visits },
    { label: top_domains_label, value: top_domains },
  ];
};
