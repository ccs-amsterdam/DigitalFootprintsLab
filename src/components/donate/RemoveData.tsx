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
import DashboardData from "components/explore/dashboardData/DashboardData";

import db from "apis/db";
import DataTable from "components/explore/dashboards/dashboardParts/DataTable";
import useLogger from "util/useLogger";

import { Trans, useTranslation } from "react-i18next";
import MenuGridRow from "components/routing/MenuGridRow";

const RemoveData = () => {
  const [data, setData] = useState({});
  const log = useLogger("Remove data");

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "calc(100vh - 38px)", width: "100vw" }}>
        <MenuGridRow />
        <Grid.Row>
          <Grid.Column width={4}>
            <KeywordInput setData={setData} />
          </Grid.Column>
          <Grid.Column width={12} style={{ height: "calc(100% - 40px)", marginTop: "30px" }}>
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
  const { t } = useTranslation();

  const onSearch = async () => {
    setStatus("loading");
    let queries = text.split("\n").map((q) => q.trim());
    queries = queries.filter((q) => q.length >= 3);

    const dataNames = await db.idb.data.toCollection().keys();
    const results = {};
    for (const name of dataNames) {
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
      <Header style={{ color: "white" }}>{t("donate.remove.header")}</Header>

      <ul style={{ color: "white" }}>
        <li>{t("donate.remove.list1")}</li>
        <li>
          <Trans
            i18nKey="donate.remove.list2"
            components={{ span: <span style={{ color: "yellow" }} /> }}
          />
        </li>
        <li>{t("donate.remove.list3")}</li>
      </ul>
      <Form>
        <Dimmer active={status === "loading"}>
          <Loader />
        </Dimmer>
        <TextArea
          value={text}
          onChange={(e, d) => {
            setStatus("ready");
            setText(String(d.value));
          }}
          rows={10}
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
          {t("donate.remove.button")}
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

        border: "1px solid #ffffff3f",
        marginTop: "10px",
        marginLeft: "15px",
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
      <DataTable dashData={dashDataCopy} log={log} pagesize={5} />
    </Grid.Row>
  );
};

export default RemoveData;
