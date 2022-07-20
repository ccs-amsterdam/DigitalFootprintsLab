import React, { CSSProperties, useEffect, useState } from "react";
import { Button, Card, Grid, Header, Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import background from "images/background.jpeg";
import db from "apis/db";

import GatherCardColumn from "./GatherCardColumn";
import ExploreCardColumn from "./ExploreCardColumn";
import { useDispatch, useSelector } from "react-redux";
import { setDataStatus } from "actions";
import DonateCardColumn from "./DonateCardColumn";
import DeleteDataButton from "./DeleteDataButton";
import useLogger from "util/useLogger";
import Navi from "./Navi";
import ChangeLanguage from "./ChangeLanguage";

const DataSquare = () => {
  useLogger("Home");
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selected, setSelected] = useState(0);
  const smallScreen = useSelector((state: any) => state.smallScreen);

  useEffect(() => {
    // on startup, check statuses in db and write to redux
    db.getDataStatus()
      .then((ds) => dispatch(setDataStatus(ds)))
      .catch((e) => console.log(e));
  }, [dispatch]);

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
      }}
    >
      <div style={{ position: "absolute", bottom: "0", left: "5px", color: "white" }}>
        Version 1.0.3
      </div>
      <div
        style={{
          display: "flex",
          padding: "0px",
          overflow: "hidden",
          height: "100%",
        }}
      >
        <CardColumn
          key={"gather"}
          title={t("home.gather.title")}
          icon="cloud download"
          description={t("home.gather.description")}
          i={0}
          selected={selected}
          setSelected={setSelected}
          smallScreen={smallScreen}
        >
          <GatherCardColumn />
        </CardColumn>
        <CardColumn
          key={"explore"}
          title={t("home.explore.title")}
          icon="search"
          description={t("home.explore.description")}
          i={1}
          selected={selected}
          setSelected={setSelected}
          smallScreen={smallScreen}
        >
          <ExploreCardColumn />
        </CardColumn>
        <CardColumn
          key={"donate"}
          title={t("home.donate.title")}
          icon="student"
          description={t("home.donate.description")}
          i={2}
          selected={selected}
          setSelected={setSelected}
          smallScreen={smallScreen}
        >
          <DonateCardColumn />
        </CardColumn>
      </div>
    </div>
  );
};

const columnStyle: CSSProperties = {
  textAlign: "center",
  marginBottom: "1em",
  padding: "20px 10px 20px 10px",
  margin: "0px",
  transition: "margin 0.5s",
  flex: "0 0 auto",
  height: "100%",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: CSSProperties = {
  color: "white",
  filter: "none",
  paddingBottom: "1em",
  paddingTop: "1em",
  background: "#00000094",
  borderRadius: "10px",
  display: "flex",
  justifyContent: "space-between",
};

const cardGroupStyle: CSSProperties = {
  overflow: "auto",
  marginTop: "2.5px",
};

const CardColumn = ({
  children,
  title,
  icon,
  description,
  i,
  selected,
  setSelected,
  smallScreen = true,
}) => {
  // if smallScreen, make each column fullsize.
  // if selected > 0, shift every column to the left by adding negative margin to first column
  const marginLeft = smallScreen && i === 0 ? `-${selected * 100}vw` : "0px";
  const width = smallScreen ? "100vw" : "33.3vw";

  const iconStyle = smallScreen ? { cursor: "pointer" } : { width: "0px", color: "transparent" };
  const canGoRight = smallScreen && selected < 2;
  const canGoLeft = smallScreen && selected > 0;

  return (
    <div style={{ ...columnStyle, marginLeft, width }}>
      <div style={headerStyle}>
        <Icon
          size="huge"
          name="chevron left"
          style={{ ...iconStyle, color: smallScreen && canGoLeft ? "white" : "transparent" }}
          onClick={() => {
            if (selected > 0) setSelected(selected - 1);
          }}
        />
        <div>
          <Header style={{ color: "white", fontSize: "min(max(1.8vw, 1.8em), 2em)" }}>
            <Icon name={icon} />
            {title}
          </Header>
          <p style={{ fontSize: "min(max(1.2vw, 1em),1.3em)" }}>{description}</p>
        </div>
        <Icon
          size="huge"
          name="chevron right"
          style={{ ...iconStyle, color: smallScreen && canGoRight ? "white" : "transparent" }}
          onClick={() => {
            if (selected < 2) setSelected(selected + 1);
          }}
        />
      </div>

      <Card.Group style={cardGroupStyle}>{children}</Card.Group>
    </div>
  );
};

export default DataSquare;
