import React, { ReactElement, useEffect, useState } from "react";
import { Grid, Container, Button, Item, Icon } from "semantic-ui-react";

import DataTable from "./dashboardParts/DataTable";
import QueryInput from "./dashboardParts/QueryInput";
import intersect from "util/intersect";
import useDashboardData from "../dashboardData/useDashboardData";
import useLogger from "util/useLogger";
import { useTranslation } from "react-i18next";
import transCommon from "util/transCommon";
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
    <div style={{ width: "100%", height: "100%", background: "#000000b0", overflow: "auto" }}>
      <Grid
        stackable
        verticalAlign="middle"
        style={{
          width: "100%",
          height: "100%",
          margin: "0",
        }}
      >
        <Grid.Row style={{ padding: "10px 0 10px 0" }}>
          <Grid.Column width={5}>
            <Container>
              <div style={{ padding: "6px 0 10px 0", display: "flex", flexDirection: "row" }}>
                <AltFilter altSelection={altSelection} setAltSelection={setAltSelection} />
                <div style={{ flex: "1 1 auto" }}>
                  <QueryInput
                    dashData={dashData}
                    searchOn={searchOn}
                    setSelection={setQuerySelection}
                  />
                </div>
              </div>
              <Statistics statistics={statistics} />
            </Container>
          </Grid.Column>
          <Grid.Column width={11} style={{ paddingTop: "10px" }}>
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
        <Grid.Row
          style={{
            width: "100%",
            padding: "0",
          }}
        >
          <Grid.Column width={16} style={{ padding: "1vw" }}>
            <VisComponent
              dashData={dashData}
              inSelection={querySelection}
              setOutSelection={setAltSelection}
            />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const AltFilter = ({ altSelection, setAltSelection }) => {
  if (!altSelection) return null;
  return (
    <>
      <Icon name="filter" size="big" style={{ paddingTop: "9px", color: "white" }} />
      <Button
        compact
        icon="window close"
        onClick={() => setAltSelection(null)}
        size="huge"
        style={{ color: "white", height: "1em", background: "#ffffff00" }}
      />
    </>
  );
};

const Statistics = ({ statistics }) => {
  const { t } = useTranslation();
  // statistics should be an array of objects, with: "label" and "value" keys.

  return (
    <div
      style={{
        height: "98%",
        padding: "20px 20px 20px 20px",
        background: "#55555587",
        borderRadius: "10px",
        margin: "0px",
        fontSize: "clamp(0.8em, 1vw, 1em)",
      }}
    >
      <Item.Group>
        {statistics.map((statistic, i) => {
          const s = transCommon(statistic.statistic, t);
          const f = transCommon(statistic.field, t);
          const label = s + " " + f;

          return (
            <Item
              key={label}
              style={{ marginTop: "0", marginBottom: i + 1 === statistics.length ? "0" : "1em" }}
            >
              <Item.Content>
                <Item.Header style={{ color: "white" }}>{label}</Item.Header>
                <Item.Description style={{ color: "white" }}>{statistic.value}</Item.Description>
              </Item.Content>
            </Item>
          );
        })}
      </Item.Group>
    </div>
  );
};

export default React.memo(DashboardTemplate);
