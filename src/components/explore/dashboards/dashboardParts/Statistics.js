import db from "apis/dexie";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Container, Dimmer, Header, Item, Loader } from "semantic-ui-react";

const propTypes = {
  /** An array with row IDs to filter on */
  selection: PropTypes.array,
  /** A string to indicate the loading status */
  loading: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
};

/**
 * Creates a list of statistics based on the selected table
 */
const Statistics = ({ selection, loading }) => {
  const [data, setData] = useState([]);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchFromDb(setData, setLoadingData, selection);
  }, [selection, setData]);

  return (
    <Container
      style={{
        height: "98%",
        padding: "20px",
        background: "#55555587",
        borderRadius: "10px",
      }}
    >
      <Dimmer active={loading || loadingData}>
        <Loader />
      </Dimmer>
      <Header as="h1" align={"center"} style={{ color: "white", padding: "0", margin: "0" }}>
        Statistics
      </Header>
      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Website Visits</Item.Header>
            <Item.Description style={{ color: "white" }}>{data.total_visits}</Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Most Visited Domain</Item.Header>
            <Item.Description style={{ color: "white" }}>
              {data.max_domain} ({data.max})
            </Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Average visits per Domain</Item.Header>
            <Item.Description style={{ color: "white" }}>{data.mean}</Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Number of Unique Domains</Item.Header>
            <Item.Description style={{ color: "white" }}>{data.num_domains}</Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Google Searches</Item.Header>
            <Item.Description style={{ color: "white" }}>{data.search}</Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Youtube Videos</Item.Header>
            <Item.Description style={{ color: "white" }}>{data.youtube}</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Container>
  );
};

const fetchFromDb = async (setData, setLoadingData, selection) => {
  setLoadingData(true);
  db.getDataFrame(selection).then(async (stats) => {
    const data = stats.sortBy("domain");
    let group = data.groupBy("domain");

    let counts = group.aggregate((group) => group.count()).rename("aggregation", "domain_count");
    counts = counts.sortBy("domain_count", true);

    const statistics = {};
    const total_visits = data.count();
    statistics["total_visits"] = total_visits;
    statistics["max"] = total_visits && counts.stat.max("domain_count");
    statistics["max_domain"] = total_visits && counts.getRow(0).get("domain");
    statistics["mean"] = total_visits && Math.round(counts.stat.mean("domain_count"));
    statistics["num_domains"] = counts.count();
    statistics["youtube"] = await db.getTableN("youtube");
    statistics["search"] = await db.getTableN("searchhistory");

    setData(statistics);
    setLoadingData(false);
  });
};

Statistics.propTypes = propTypes;
export default React.memo(Statistics);
