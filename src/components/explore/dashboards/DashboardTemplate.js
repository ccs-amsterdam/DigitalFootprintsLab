import React, { useEffect, useState } from "react";
import { Grid, Icon, Button, Container, Header, Item } from "semantic-ui-react";

import { useHistory } from "react-router";

import ColoredBackgroundGrid from "./dashboardParts/ColoredBackgroundGrid";
import background from "images/background.jpeg";

import DataTable from "./dashboardParts/DataTable";
import QueryInput from "./dashboardParts/QueryInput";
import intersect from "util/intersect";

const topRowHeight = "700px";
const gridStyle = { paddingTop: "0em", marginTop: "0em" };

/**
 * Re-usable component for making a dashboard.
 */
const DashboardTemplate = ({
  children,
  dashData,
  searchOn,
  columns,
  querySelection,
  setQuerySelection,
  altSelection,
  selection,
  statistics,
}) => {
  const history = useHistory();

  // The selection states are arrays of row ids
  // the intersection of these arrays is used to combine selections
  // this is ok-ish fast, since the id indices are ordered, and intersect is plenty smart

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid divided={"vertically"} style={gridStyle}>
        <Grid.Row style={{ height: topRowHeight }}>
          <Grid.Column width={12}>
            <Button
              style={{ background: "#ffffff", margin: "0", marginLeft: "5px", marginTop: "0.5em" }}
              onClick={() => history.push("/datasquare")}
            >
              <Icon name="backward" />
              Go back
            </Button>

            {children}
          </Grid.Column>
          <Grid.Column width={4}>
            <Container
              style={{
                margin: "50px",
                padding: "20px",
                height: "80%",
              }}
            >
              <div style={{ marginBottom: "1em" }}>
                <QueryInput
                  dashData={dashData}
                  searchOn={searchOn}
                  setSelection={setQuerySelection}
                />
              </div>

              <Statistics statistics={statistics} />
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          style={{ maxHeight: `calc(100vh - ${topRowHeight})`, minHeight: "500px", width: "100%" }}
        >
          <DataTable dashData={dashData} columns={columns} selection={selection} />
        </Grid.Row>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const Statistics = ({ statistics }) => {
  // statistics should be an array of objects, with: "label" and "value" keys.

  return (
    <Container
      style={{
        height: "98%",
        padding: "20px",
        background: "#55555587",
        borderRadius: "10px",
      }}
    >
      <Header as="h1" align={"center"} style={{ color: "white", padding: "0", margin: "0" }}>
        Statistics
      </Header>
      <Item.Group>
        {statistics.map((statistic) => {
          return (
            <Item>
              <Item.Content>
                <Item.Header style={{ color: "white" }}>{statistic.label}</Item.Header>
                <Item.Description style={{ color: "white" }}>{statistic.value}</Item.Description>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Container>
  );
};

export default DashboardTemplate;
