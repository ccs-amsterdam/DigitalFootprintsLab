import React from "react";
import DashboardTemplate from "./dashboards/DashboardTemplate";
//import CirclePack from "./dashboards/dashboardParts/CirclePack";
import Wordcloud from "./dashboards/dashboardParts/Wordcloud";
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

// const VisComponent = ({ dashData, inSelection, setOutSelection }) => {
//   if (!dashData) return null;
//   return (
//     <div>
//       <CirclePack
//         dashData={dashData}
//         group={GROUP}
//         grouptype="domain"
//         inSelection={inSelection}
//         setOutSelection={setOutSelection}
//       />
//     </div>
//   );
// };

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
  const counts = dashData.count(GROUP, selection);
  const total_visits = dashData.N(selection);

  let domains = 0;
  let top_domains = [];
  const n_top_domains = 5;

  for (const key of Object.keys(counts)) {
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
  const top_domains_i = [...Array(n_top_domains).keys()];
  const top_domains_list = (
    <div style={{ display: "grid", grid: "auto-flow / 20px 1fr", gridGap: "2px 10px" }}>
      {top_domains_i.map((i) => {
        if (i >= top_domains.length)
          return <List.Content style={{ gridRow: i + 1, gridColumn: 2 }}>&nbsp;</List.Content>;
        const mv = i < top_domains.length ? top_domains[i] : null;
        return (
          <>
            <Image
              style={{ gridRow: i + 1, gridColumn: 1, height: "19px", width: "20px" }}
              src={mv?.image}
            />
            <List.Content style={{ gridRow: i + 1, gridColumn: 2 }}>{`${mv?.key.replace(
              /www[^.]*\./,
              ""
            )} (${mv?.count})`}</List.Content>
          </>
        );
      })}
    </div>
  );

  const top_domains_field = domains > 1 ? "domains" : "domain";
  return [
    { statistic: "Total", field: "visits", value: total_visits },
    { statistic: "Top", field: top_domains_field, value: top_domains_list },
  ];
};
