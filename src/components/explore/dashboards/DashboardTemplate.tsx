import React, { ReactElement, useEffect, useState } from "react";
import { Grid, Button, Icon } from "semantic-ui-react";

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
  //const [sources, setSources] = useState(null);

  useEffect(() => {
    setSelection(intersect([querySelection, altSelection?.ids || null]));

    // if altSelection has no hits, delete selection altogether
    if (altSelection && altSelection.ids.length === 0) setAltSelection(null);
  }, [querySelection, altSelection, setAltSelection]);

  useEffect(() => {
    setStatistics(calcStatistics(dashData, selection));

    // let sources = {};
    // const n = dashData?.data?.length || 0;
    // for (let i = 0; i < n; i++) {
    //   sources[dashData.data[i]._source] = true;
    // }
    // setSources(Object.keys(sources));
  }, [dashData, selection, calcStatistics]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",

        display: "flex",
        flexDirection: "column",
        transition: "height 1s",
      }}
    >
      <div
        style={{
          flex: "1 1 auto",
          padding: "10px 10px 0px 10px",
          textAlign: "center",
          color: "white",
          zIndex: 5,
          height: "40px",
          backdropFilter: "blur(2px",
          fontSize: "1em",
        }}
      >
        <span style={{ fontSize: "1.3em", fontWeight: "bold" }}>{dataName.toUpperCase()}</span>
      </div>
      <Grid
        stackable
        verticalAlign="middle"
        style={{
          margin: "0",
          background: "#00000088",

          marginTop: "-50px",
          paddingTop: "50px",
          zIndex: 0,
          width: "100%",
          height: "100%",
          overflow: "auto",
          alignItems: "flex-start",
        }}
      >
        <Grid.Column width={6} style={{ paddingBottom: "0px !important" }}>
          <Statistics statistics={statistics} />
        </Grid.Column>

        <Grid.Column width={10} style={{ paddingTop: "5px" }}>
          <VisComponent
            dashData={dashData}
            inSelection={querySelection}
            outSelection={altSelection}
            setOutSelection={setAltSelection}
          />
        </Grid.Column>
      </Grid>
      <div
        style={{
          flex: "1 1 auto",
          background: "#000000b0",

          borderTop: "1px solid white",
          padding: "10px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: "100%",
            width: "100%",
            padding: "10px 10px 0px 10px",
            marginBottom: "10px",
            display: "flex",
            flexDirection: "row",
            maxWidth: "600px",
            zIndex: 5,
            fontSize: "1em",
          }}
        >
          <AltFilter altSelection={altSelection} setAltSelection={setAltSelection} />
          <div style={{ flex: "1 1 auto", minWidth: "50%" }}>
            <QueryInput dashData={dashData} searchOn={searchOn} setSelection={setQuerySelection} />
          </div>
        </div>
        <div style={{ flex: "1 1 auto", width: "100%" }}>
          <DataTable
            dashData={dashData}
            columns={columns}
            selection={selection}
            pagesize={6}
            log={log}
            unstackable
            minified
          />
        </div>
      </div>
    </div>
  );
};

const AltFilter = ({ altSelection, setAltSelection }) => {
  if (!altSelection) return null;
  return (
    <div
      style={{
        height: "38px",
        maxWidth: "50%",
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Icon name="filter" size="big" style={{ color: "white", paddingTop: "4px" }} />
      <div
        style={{ padding: "5px 2px 0px 5px", color: "white", fontSize: "1em", overflow: "auto" }}
      >
        {altSelection?.selected}
      </div>
      <Button
        compact
        icon="window close"
        onClick={() => setAltSelection(null)}
        size="huge"
        style={{ color: "white", padding: "0px 5px 5px 5px", background: "#ffffff00" }}
      />
    </div>
  );
};

const Statistics = ({ statistics }) => {
  const { t } = useTranslation();
  // statistics should be an array of objects, with: "label" and "value" keys.

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        padding: "10px 20px 10px 20px",
        background: "#55555587",
        borderRadius: "10px",
        margin: "0px",
        color: "white",
        fontSize: "clamp(0.8em, 1vw, 1em)",
        display: "grid",
        grid: "auto-flow / 1fr 2fr",
        justifyItems: "stretch",
        alignItems: "center",
        gridGap: "10px 1.5em",
        overflow: "auto",
      }}
    >
      {statistics.map((statistic, i) => {
        const s = transCommon(statistic.statistic, t);
        const f = transCommon(statistic.field, t);
        const label = s + " " + f;

        return (
          <>
            <div
              key={label + "left"}
              style={{
                gridRow: i + 1,
                gridColumn: 1,
                fontSize: "1.3em",
                fontWeight: "bold",
              }}
            >
              {label}
            </div>
            <div key={label + "right"} style={{ gridRow: i + 1, gridColumn: 2, fontSize: "1.1em" }}>
              <span style={{ whiteSpace: "nowrap" }}>{statistic.value}</span>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default React.memo(DashboardTemplate);
