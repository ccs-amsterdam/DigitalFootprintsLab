import React, { useEffect, useState } from "react";
import { Container, Dimmer, Header, Item, Loader } from "semantic-ui-react";

/**
 * Creates a list of statistics based on the selected table
 */
const VisitStatistics = ({ dashData, field, selection, label }) => {
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dashData) {
      setStatistics({});
      return;
    }
    setLoading(true);
    const counts = dashData.count(field, selection);

    const stats = {};
    stats.total_visits = 0;
    stats.most_visited = ["none", 0]; // array of [0] key and [1] count
    stats.unique = 0;
    for (let key of Object.keys(counts)) {
      stats.total_visits += counts[key];
      stats.unique++;
      if (counts[key] > stats.most_visited[1]) stats.most_visited = [key, counts[key]];
    }
    setStatistics(stats);
    setLoading(false);
  }, [dashData, selection, field, setLoading]);

  return (
    <Container
      style={{
        height: "98%",
        padding: "20px",
        background: "#55555587",
        borderRadius: "10px",
      }}
    >
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <Header as="h1" align={"center"} style={{ color: "white", padding: "0", margin: "0" }}>
        Statistics
      </Header>
      <Item.Group>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Total visits</Item.Header>
            <Item.Description style={{ color: "white" }}>
              {statistics?.total_visits}
            </Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Most Visited</Item.Header>
            <Item.Description style={{ color: "white" }}>
              {statistics?.most_visited?.[0]} ({statistics?.most_visited?.[1]})
            </Item.Description>
          </Item.Content>
        </Item>
        <Item>
          <Item.Content>
            <Item.Header style={{ color: "white" }}>Unique {label || field}s</Item.Header>
            <Item.Description style={{ color: "white" }}>{statistics?.unique}</Item.Description>
          </Item.Content>
        </Item>
      </Item.Group>
    </Container>
  );
};

export default React.memo(VisitStatistics);
