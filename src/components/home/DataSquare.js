import React, { useEffect } from "react";
import { Card, Grid, Header, Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import background from "images/background.jpeg";
import db from "apis/db";

import GatherCardColumn from "./GatherCardColumn";
import ExploreCardColumn from "./ExploreCardColumn";
import { useDispatch } from "react-redux";
import { setDataStatus } from "actions";
import DonateCardColumn from "./DonateCardColumn";
import DeleteDataButton from "./DeleteDataButton";
import useLogger from "util/useLogger";
import Navi from "./Navi";
import ChangeLanguage from "./ChangeLanguage";

const headerStyle = {
  color: "white",
  filter: "none",
  background: "#00000094",
  paddingBottom: "0.3em",
  paddingTop: "1em",
  borderRadius: "10px",
};

const columnStyle = {
  marginBottom: "1em",
};

const cardGroupStyle = {
  marginTop: "2em",
};

const DataSquare = () => {
  useLogger("Home");
  const { t } = useTranslation();
  const dispatch = useDispatch();

  useEffect(() => {
    // on startup, check statuses in db and write to redux
    db.getDataStatus()
      .then((ds) => dispatch(setDataStatus(ds)))
      .catch((e) => console.log(e));
  }, [dispatch]);

  return (
    <div
      style={{
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "100% 100%",
        overflow: "auto",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", bottom: "0", left: "5px", color: "white" }}>
        Version 1.0.2
      </div>
      <Grid stackable divided centered>
        <Grid.Row style={{ minHeight: "60px" }}>
          <Grid.Column width={15} textAlign="right">
            <Navi />
            <ChangeLanguage />
            <DeleteDataButton />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title={t("home.gather.title")}
              icon="cloud download"
              description={t("home.gather.description")}
            />

            <Card.Group style={cardGroupStyle}>
              <GatherCardColumn />
            </Card.Group>
          </Grid.Column>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title={t("home.explore.title")}
              icon="search"
              description={t("home.explore.description")}
            />

            <Card.Group style={cardGroupStyle}>
              <ExploreCardColumn />
            </Card.Group>
          </Grid.Column>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title={t("home.donate.title")}
              icon="student"
              description={t("home.donate.description")}
            />

            <Card.Group style={cardGroupStyle}>
              <DonateCardColumn />
            </Card.Group>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

const ColumnHeader = ({ title, icon, description }) => {
  return (
    <div style={headerStyle}>
      <Header style={{ color: "white", fontSize: "min(max(1.8vw, 1.8em), 2em)" }}>
        <Icon name={icon} />
        {title}
      </Header>
      <p style={{ fontSize: "min(max(1.2vw, 1em),1.3em)" }}>{description}</p>
    </div>
  );
};

export default DataSquare;
