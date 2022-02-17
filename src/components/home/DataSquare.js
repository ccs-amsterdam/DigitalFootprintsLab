import React, { useEffect } from "react";
import { Card, Grid, Header, Icon, Button, Popup } from "semantic-ui-react";
import background from "images/background.jpeg";
import db from "apis/db";

import GatherCardColumn from "./GatherCardColumn";
import ExploreCardColumn from "./ExploreCardColumn";
import { useDispatch } from "react-redux";
import { setDataStatus } from "actions";
import DonateCardColumn from "./DonateCardColumn";

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
  const dispatch = useDispatch();

  useEffect(() => {
    // on startup, check statuses in db and write to redux
    db.idb.dataStatus
      .toArray()
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
      }}
    >
      <Grid stackable divided centered>
        <Grid.Row style={{ height: "60px" }}>
          <Grid.Column>
            <DeleteDataButton />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title="Gather"
              icon="cloud download"
              description="Click a card to gather your data"
            />

            <Card.Group style={cardGroupStyle}>
              <GatherCardColumn />
            </Card.Group>
          </Grid.Column>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title="Explore"
              icon="search"
              description="This step is optional, but aren't you curious?"
            />

            <Card.Group style={cardGroupStyle}>
              <ExploreCardColumn />
            </Card.Group>
          </Grid.Column>
          <Grid.Column textAlign="center" width={5} style={columnStyle}>
            <ColumnHeader
              title="Donate"
              icon="student"
              description="Support academic research by sharing your data"
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

const DeleteDataButton = () => {
  const button = (
    <Button
      style={{
        float: "right",
        background: "#00000000",
        margin: "10px",
        color: "white",
        border: "1px solid white",
      }}
    >
      <Icon name="trash" />
      Delete all data
    </Button>
  );

  return (
    <Popup on="click" trigger={button}>
      <Popup.Header>Delete data from browser</Popup.Header>
      <Popup.Content>
        <p>Do you want to delete all the gathered data from the browser?</p>
        <p>
          Note that any data you downloaded will still be on your computer, so you might want to
          delete that as well.
        </p>
      </Popup.Content>
      <br />
      <Button
        negative
        fluid
        onClick={() =>
          db.destroyEverything().then(() => {
            window.location.reload("/");
          })
        }
      >
        Delete data
      </Button>
    </Popup>
  );
};

export default DataSquare;
