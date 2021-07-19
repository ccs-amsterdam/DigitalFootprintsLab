import React, { useEffect, useState } from "react";
import ColoredBackgroundGrid from "./ColoredBackgroundGrid";
import background from "../images/background.jpeg";
import DataList from "./DataList";
import db from "../apis/dexie";
import { Button, ButtonGroup, Divider, Grid, Icon } from "semantic-ui-react";

import QueryTable from "./QueryTable";
import KeyCloud from "./KeyCloud";
import TimeLine from "./TimeLine";
import intersect from "../util/intersect";

const gridStyle = { paddingTop: "0em", marginTop: "0em", height: "90vh" };
const gridColumnStyle = {
  paddingLeft: "2em",
  paddingRight: "1em",
  height: "100%",
};

const SEARCHON = ["url", "title"];

const LAYOUT = {
  url: { type: "header", style: { color: "white" } },
  title: { type: "description", style: { color: "white" } },
  date: { type: "meta", style: { color: "white", fontStyle: "italic" } },
};

//https://nivo.rocks/calendar/
//https://github.com/motiz88/react-dygraphs#readme
//https://nivo.rocks/heatmap/   maybe for weekday by time

// let querytable accept a preselection
// this can be any selection from indices (date, domain)

const BrowsingHistory = () => {
  const [querySelection, setQuerySelection] = useState(null);
  const [cloudSelection, setCloudSelection] = useState(null);
  const [selection, setSelection] = useState(null);
  const [loading, setLoading] = useState(false);

  const [keyCloudSelection, setKeyCloudSelection] = useState(null);
  const [timelineSelection, setTimelineSelection] = useState(null);

  useEffect(() => {
    console.log(querySelection);
    console.log(cloudSelection);
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
        <Grid.Column width={4} style={{ ...gridColumnStyle }}>
          <Grid.Row centered style={{ padding: "2em", paddingRight: "0" }}>
            <QueryTable
              table={"browsing_history"}
              searchOn={SEARCHON}
              setSelection={setQuerySelection}
              setLoading={setLoading}
            />
          </Grid.Row>
          <Grid.Row style={{ height: "90vh" }}>
            <DataList
              table={"browsing_history"}
              layout={LAYOUT}
              selection={selection}
              loading={loading}
            />
          </Grid.Row>
        </Grid.Column>
        <Grid.Column width={12} style={{ padding: "0", paddingRight: "1em" }}>
          <br />
          <Grid.Row>
            <KeyCloud
              table={"browsing_history"}
              field={"domain"}
              selection={keyCloudSelection}
              nWords={50}
              loading={loading}
              setSelection={setCloudSelection}
            />
          </Grid.Row>
          <Divider style={{ borderColor: "white" }} />
          <Grid.Row>
            <TimeLine
              table={"browsing_history"}
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

export default BrowsingHistory;
