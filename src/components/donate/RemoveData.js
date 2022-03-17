import React, { useEffect, useState } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import {
  Container,
  Grid,
  TextArea,
  Form,
  Header,
  Button,
  Icon,
  Dimmer,
  Loader,
} from "semantic-ui-react";
import background from "images/background.jpeg";
import BackButton from "components/routing/BackButton";
import DashboardData from "components/explore/dashboardData/DashboardData";

import db from "apis/db";
import DataTable from "components/explore/dashboards/dashboardParts/DataTable";
import useLogger from "util/useLogger";
import ExploreButtons from "components/routing/ExploreButtons";
import DonateButtons from "components/routing/DonateButtons";

const RemoveData = () => {
  const [data, setData] = useState({});
  const log = useLogger("Remove data");

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "100vh", width: "100vw" }}>
        <Grid.Row style={{ paddingBottom: "0" }}>
          <Grid.Column
            width={16}
            style={{
              minHeight: "70px",
              display: "flex",
              justifyContent: "space-between",
              alignContent: "flex-start",
              flexWrap: "wrap",
            }}
          >
            <BackButton />
            <ExploreButtons />

            <DonateButtons />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={6}>
            <KeywordInput setData={setData} />
          </Grid.Column>
          <Grid.Column width={10} style={{ height: "100%", marginTop: "30px" }}>
            <Grid>
              {Object.keys(data).map((key) => {
                return <ResultsTable key={key} title={key} dashData={data[key]} log={log} />;
              })}
            </Grid>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const KeywordInput = ({ setData }) => {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("ready");

  const onSearch = async () => {
    setStatus("loading");
    let queries = text.split("\n").map((q) => q.trim());
    queries = queries.filter((q) => q.length >= 3);

    const dataNames = await db.idb.data.toCollection().keys();
    const results = {};
    for (let name of dataNames) {
      const data = await db.getData(name);
      const dashData = new DashboardData(name, data.data, (dd) => {
        const newdata = { ...data.data };
        newdata[name] = dd;
        setData(newdata);
      });

      const hits = queries.length > 0 ? dashData.search(queries) : [];
      dashData.subset(hits);
      results[name] = dashData;
    }
    setData(results);
    setStatus("waiting input");
  };

  return (
    <Container
      style={{
        margin: "50px",
        padding: "20px",
        height: "100%",
        width: "25em",
      }}
    >
      <Header style={{ color: "white" }}>Filter Terms</Header>

      <ul style={{ color: "white" }}>
        <li>Type one search term per row</li>
        <li>
          <span style={{ color: "yellow" }}>secret</span> will also match{" "}
          <span style={{ color: "yellow" }}>www.supersecret.com</span>
        </li>
        <li>Terms needs to be at least 3 characters long</li>
      </ul>
      <Form>
        <Dimmer active={status === "loading"}>
          <Loader />
        </Dimmer>
        <TextArea
          value={text}
          onChange={(e, d) => {
            setStatus("ready");
            setText(d.value);
          }}
          rows={25}
          style={{ width: "100%" }}
        />
        ;
        <Button
          size="large"
          primary
          fluid
          disabled={status === "waiting input"}
          onClick={() => onSearch()}
        >
          <Icon size="large" name="search" />
          Search
        </Button>
      </Form>
    </Container>
  );
};

const ResultsTable = ({ title, dashData, log }) => {
  const [dashDataCopy, setDashDataCopy] = useState(null);

  useEffect(() => {
    // This is some voodoo here
    // dashData has a setData method to update itself, so it can trigger a rerender when an item is deleted
    // We can't do that here because dashData is created with the search onclick event.
    // So instead we set the method to update the dashDataCopy
    dashData.setData = (dd) => setDashDataCopy(dd);
    setDashDataCopy(dashData);
  }, [dashData]);

  if (!dashDataCopy) return null;

  return (
    <Grid.Row
      style={{
        //minHeight: "500px",
        //maxHeight: "calc(100vh - 500px)",
        //width: "100%",
        minHeight: "70px",
        maxHeight: "340px",
        border: "5px solid #ffffff3f",
        marginTop: "10px",
        position: "relative",
      }}
    >
      <Header
        style={{
          position: "absolute",
          fontSize: "1.8em",
          top: "5px",
          left: "5px",
          color: "#ffffff",
        }}
      >
        {title}
      </Header>
      <DataTable dashData={dashDataCopy} log={log} />
    </Grid.Row>
  );
};

export default RemoveData;
