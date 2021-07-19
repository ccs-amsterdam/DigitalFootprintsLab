import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataList from "./DataList";
import { Divider, Grid, Icon, Button, ButtonGroup } from "semantic-ui-react";

import QueryTable from "./QueryTable";
import KeyCloud from "./KeyCloud";
import TimeLine from "./TimeLine";
import intersect from "../util/intersect";

const gridStyle = { paddingTop: "0em", marginTop: "0em", height: "90vh" };
const gridColumnStyle = {
  paddingLeft: "2em",
  paddingRight: "1em",
  paddingTop: "0",
  height: "100%",
};

//https://nivo.rocks/calendar/
//https://github.com/motiz88/react-dygraphs#readme
//https://nivo.rocks/heatmap/   maybe for weekday by time

// let querytable accept a preselection
// this can be any selection from indices (date, domain)

const History = ({ searchOn, layout, table, cloudKey }) => {
  const [querySelection, setQuerySelection] = useState(null);
  const [cloudSelection, setCloudSelection] = useState(null);
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);
  const history = useHistory();

  const [keyCloudSelection, setKeyCloudSelection] = useState(null);
  const [timelineSelection, setTimelineSelection] = useState(null);

  useEffect(() => {
    setSelection(intersect([querySelection, cloudSelection]));
  }, [querySelection, cloudSelection]);

  useEffect(() => {
    //setKeyCloudSelection(intersect([querySelection, cloudSelection]));
    setKeyCloudSelection(querySelection);
  }, [querySelection]);

  useEffect(() => {
    setTimelineSelection(intersect([querySelection, cloudSelection]));
  }, [querySelection, cloudSelection]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid divided={"vertically"} style={gridStyle}>
        <Grid.Column
          width={4}
          style={{ ...gridColumnStyle, borderRight: "2px solid white", height: "100vh" }}
        >
          <Grid.Row centered style={{ padding: "1em", paddingRight: "0" }}>
            <QueryTable
              table={table}
              searchOn={searchOn}
              setSelection={setQuerySelection}
              setLoading={setLoading}
            />
          </Grid.Row>
          <Grid.Row style={{ height: "90vh" }}>
            <DataList table={table} layout={layout} selection={selection} loading={loading} />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={12} style={{ padding: "0", paddingLeft: "1em", paddingRight: "1em" }}>
          <Grid.Row style={{ paddingBottom: "0", paddingRight: "0" }} textAlign="right">
            <Grid.Column style={{ paddingBottom: "0", paddingRight: "0" }}>
              <Button.Group floated="right">
                <Button
                  style={{ background: "#ffffff", margin: "0" }}
                  onClick={() => history.push("/datasquare")}
                >
                  <Icon name="backward" />
                  Go back
                </Button>
              </Button.Group>
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <KeyCloud
              table={table}
              field={cloudKey}
              selection={keyCloudSelection}
              nWords={50}
              loading={loading}
              setSelection={setCloudSelection}
            />
          </Grid.Row>
          <Divider style={{ borderColor: "white" }} />
          <Grid.Row>
            <TimeLine
              table={table}
              field={"date"}
              selection={timelineSelection}
              loading={loading}
              setSelection={setCloudSelection}
            />
          </Grid.Row>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

export default History;
