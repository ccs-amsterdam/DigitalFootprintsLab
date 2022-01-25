import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Divider, Grid, Icon, Button, Container } from "semantic-ui-react";

import { useHistory } from "react-router";

import ColoredBackgroundGrid from "./dashboardParts/ColoredBackgroundGrid";
import background from "images/background.jpeg";

import DataTable from "./dashboardParts/DataTable";
import QueryInput from "./dashboardParts/QueryInput";
import intersect from "util/intersect";
import Statistics from "./dashboardParts/Statistics";
import KeyCloud from "./dashboardParts/KeyCloud";
import useData from "../hooks/useData";

const topRowHeight = "700px";
const gridStyle = { paddingTop: "0em", marginTop: "0em" };

const propTypes = {
  /** an Array indicating which fields in table should be used in the fulltext search */
  searchOn: PropTypes.array.isRequired,
  /** an array that conveys which fields in the table are shown in the DataTable. See DataTable for details */
  columns: PropTypes.array.isRequired,
  /** the name of the table in the indexedDB */
  table: PropTypes.string.isRequired,
  /** the field in the table that is used in the wordcloud. Can also be a multientry index (e.g., an indexed array of words in indexedDB) */
  cloudKey: PropTypes.string.isRequired,
};

/**
 * Renders a dashboard page with components for browsing and visualizing history data
 */
const HistoryDashboard = ({ searchOn, columns, table, cloudKey }) => {
  const history = useHistory();
  const allColumns = React.useMemo(
    () => new Set([...columns, ...searchOn, cloudKey]),
    [columns, searchOn, cloudKey]
  );
  const dashData = useData(table, allColumns);

  //const dashData = useDashboardData(table, searchOn, cloudKey);
  const [loading, setLoading] = useState(false);

  // The selection states are arrays of row ids
  // the intersection of these arrays is used to combine selections
  // this is ok-ish fast, since the id indices are ordered, and intersect is plenty smart
  const [selection, setSelection] = useState(null);
  const [querySelection, setQuerySelection] = useState(null);
  const [keySelection, setKeySelection] = useState(null);

  useEffect(() => {
    setSelection(intersect([querySelection, keySelection]));
  }, [querySelection, keySelection]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid divided={"vertically"} style={gridStyle}>
        <Grid.Row style={{ height: topRowHeight }}>
          <Grid.Column width={10}>
            <Button
              style={{ background: "#ffffff", margin: "0", marginLeft: "5px", marginTop: "0.5em" }}
              onClick={() => history.push("/datasquare")}
            >
              <Icon name="backward" />
              Go back
            </Button>

            <KeyCloud
              table={table}
              field={cloudKey}
              dashData={dashData}
              inSelection={querySelection}
              nWords={50}
              loading={loading}
              setOutSelection={setKeySelection}
            />

            {/* <BubbleChart
              table={table}
              field={cloudKey}
              inSelection={selection}
              loading={loading}
              setOutSelection={setKeySelection}
            /> */}
          </Grid.Column>
          <Grid.Column width={6}>
            <Container
              style={{
                margin: "50px",
                padding: "20px",
                height: "80%",
              }}
            >
              <div style={{ marginBottom: "1em", marginLeft: "1.6em" }}>
                <QueryInput
                  dashData={dashData}
                  searchOn={searchOn}
                  setSelection={setQuerySelection}
                  setLoading={setLoading}
                />
              </div>

              <Statistics selection={selection} loading={loading} />
            </Container>
          </Grid.Column>
        </Grid.Row>
        <Divider style={{ margin: "0" }} />
        <Grid.Row
          style={{ maxHeight: `calc(100vh - ${topRowHeight})`, minHeight: "300px", width: "100%" }}
        >
          <DataTable
            dashData={dashData}
            columns={columns}
            selection={selection}
            loading={loading}
          />
        </Grid.Row>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

HistoryDashboard.propTypes = propTypes;
export default HistoryDashboard;
