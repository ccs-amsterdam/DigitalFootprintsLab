import React, { useEffect, useState } from "react";
import { Grid, Container, Header, Item } from "semantic-ui-react";

import ColoredBackgroundGrid from "./dashboardParts/ColoredBackgroundGrid";
import background from "images/background.jpeg";

import DataTable from "./dashboardParts/DataTable";
import QueryInput from "./dashboardParts/QueryInput";
import intersect from "util/intersect";
import useDashboardData from "../dashboardData/useDashboardData";
import PropTypes from "prop-types";
import BackButton from "components/routing/BackButton";
import useLogger from "util/useLogger";
import ExploreButtons from "components/routing/ExploreButtons";
import DonateButtons from "components/routing/DonateButtons";

const propTypes = {
  /** The name of the type of data to explore. */
  dataName: PropTypes.string.isRequired,
  /** an Array indicating which fields in table should be used in the fulltext search */
  searchOn: PropTypes.array.isRequired,
  /** an array that conveys which fields in the table are shown in the DataTable. See DataTable for details */
  columns: PropTypes.array.isRequired,
  /** A react component that produces a visualization. Gets the properties dashData, inSelection and setOutSelection */
  VisComponent: PropTypes.func.isRequired,
  /** A function to produce the statistics. Gets arguments dashData and selection, and needs to return an array of objects
   *  with keys 'label' and 'value'.
   */
  calcStatistics: PropTypes.func.isRequired,
};

/**
 * Re-usable component for making a dashboard. See e.g., BrowsingHistory.js for an example of how to use
 */
const DashboardTemplate = ({ dataName, searchOn, columns, VisComponent, calcStatistics }) => {
  const dashData = useDashboardData(dataName);
  const [statistics, setStatistics] = useState([]);
  const [altSelection, setAltSelection] = useState(null);
  const [querySelection, setQuerySelection] = useState(null);
  const [selection, setSelection] = useState(null);
  const log = useLogger("Explore " + dataName);

  useEffect(() => {
    setSelection(intersect([querySelection, altSelection]));
  }, [querySelection, altSelection]);

  useEffect(() => {
    setStatistics(calcStatistics(dashData, selection));
  }, [dashData, selection, calcStatistics]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "100vh", width: "100vw" }}>
        <Grid.Row style={{ paddingBottom: "0" }}>
          <Grid.Column
            width={16}
            style={{
              minHeight: "70px",
              display: "flex",
              justifyContent: "space-evenly",
              flexWrap: "wrap",
            }}
          >
            <BackButton />
            <ExploreButtons />
            <DonateButtons />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row style={{ padding: "0", minHeight: "500px" }}>
          <Grid.Column width={4}>
            <Container
              style={{
                margin: "50px",
                marginTop: "50px",
                padding: "20px",
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
          <Grid.Column verticalAlign="middle" width={12} style={{ height: "100%", width: "100%" }}>
            <VisComponent
              dashData={dashData}
              inSelection={querySelection}
              setOutSelection={setAltSelection}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          style={{
            minHeight: "500px",
            maxHeight: "calc(100vh - 500px)",
            width: "100%",
            padding: "0",
          }}
        >
          <DataTable dashData={dashData} columns={columns} selection={selection} log={log} />
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
            <Item key={statistic.label}>
              <Item.Content>
                <Item.Header style={{ color: "white" }}>
                  {statistic.label.replace("_", " ")}
                </Item.Header>
                <Item.Description style={{ color: "white" }}>{statistic.value}</Item.Description>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Container>
  );
};

DashboardTemplate.propTypes = propTypes;
export default React.memo(DashboardTemplate);
