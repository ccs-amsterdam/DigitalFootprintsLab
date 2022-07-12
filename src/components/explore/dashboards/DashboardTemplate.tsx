import React, { ReactElement, useEffect, useState } from "react";
import { Grid, Container, Header, Item } from "semantic-ui-react";

import ColoredBackgroundGrid from "./dashboardParts/ColoredBackgroundGrid";
import background from "images/background.jpeg";

import DataTable from "./dashboardParts/DataTable";
import QueryInput from "./dashboardParts/QueryInput";
import intersect from "util/intersect";
import useDashboardData from "../dashboardData/useDashboardData";
import useLogger from "util/useLogger";
import { useTranslation } from "react-i18next";
import transCommon from "util/transCommon";
import MenuGridRow from "components/routing/MenuGridRow";
import { TableColumn } from "types";

/**
 * Re-usable component for making a dashboard. See e.g., BrowsingHistory.js for an example of how to use
 */
interface DashboardTemplateProps {
  /** The name of the type of data to explore. */
  dataName: string;
  /** an Array indicating which fields in table should be used in the fulltext search */
  searchOn: string[];
  /** an array that conveys which fields in the table are shown in the DataTable. See DataTable for details */
  columns: (string | TableColumn)[];
  /** A react component that produces a visualization. Gets the properties dashData, inSelection and setOutSelection */
  VisComponent: (props: any) => ReactElement;
  /** A function to produce the statistics. Gets arguments dashData and selection, and needs to return an array of objects
   *  with keys 'label' and 'value'.
   */
  calcStatistics: (dashData: any, selection: any) => any;
}

const DashboardTemplate = ({
  dataName,
  searchOn,
  columns,
  VisComponent,
  calcStatistics,
}: DashboardTemplateProps) => {
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
      <Grid
        stackable
        style={{
          width: "100vw",
          height: "100vh",
        }}
      >
        <MenuGridRow />
        <Grid.Row style={{ padding: "0", minHeight: "500px" }}>
          <Grid.Column width={5}>
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
          <Grid.Column
            verticalAlign="middle"
            width={11}
            style={{ height: "100%", width: "100%", marginTop: "10px" }}
          >
            <VisComponent
              dashData={dashData}
              inSelection={querySelection}
              setOutSelection={setAltSelection}
            />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row
          style={{
            width: "100%",
            padding: "0",
          }}
        >
          <Grid.Column width={16}>
            <DataTable
              dashData={dashData}
              columns={columns}
              selection={selection}
              pagesize={6}
              log={log}
              unstackable
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const Statistics = ({ statistics }) => {
  const { t } = useTranslation();
  // statistics should be an array of objects, with: "label" and "value" keys.

  return (
    <Container
      style={{
        height: "98%",
        padding: "20px",
        background: "#55555587",
        borderRadius: "10px",
        fontSize: "min(max(0.8em, 1.5vw), 1em)",
      }}
    >
      <Header
        as="h1"
        align={"center"}
        style={{
          color: "white",
          padding: "0",
          margin: "0",
          fontSize: "min(max(2em, 1.5vw), 3em)",
        }}
      >
        {t("explore.statistics.header")}
      </Header>
      <Item.Group>
        {statistics.map((statistic) => {
          const s = transCommon(statistic.statistic, t);
          const f = transCommon(statistic.field, t);
          const label = s + " " + f;
          return (
            <Item key={label}>
              <Item.Content>
                <Item.Header style={{ color: "white" }}>{label}</Item.Header>
                <Item.Description style={{ color: "white" }}>{statistic.value}</Item.Description>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </Container>
  );
};

export default React.memo(DashboardTemplate);
