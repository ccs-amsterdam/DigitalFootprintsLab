import React from "react";
import { Card, Grid, Header, Icon } from "semantic-ui-react";
import logo from "../images/logo.png";

import GatherCards from "./GatherCards";
import PlatformCards from "./PlatformCards";

const headerStyle = {
  color: "white",
  fontSize: "20px",
  filter: "none",
  background: "#00000078",
  paddingBottom: "0.3em",
  paddingTop: "0.4em",
};

const columnStyle = {
  marginBottom: "1em",
};

const cardGroupStyle = {
  marginTop: "2em",
};

const DataSquare = () => {
  return (
    <div style={{ height: "100vh", backgroundImage: `url(${logo})`, backgroundSize: "100% 100%" }}>
      <Grid stackable divided centered style={{ paddingTop: "4em" }}>
        <Grid.Column textAlign="center" width={5} style={columnStyle}>
          <Header style={headerStyle}>
            <Icon name="cloud download" />
            Gather
          </Header>

          <Card.Group style={cardGroupStyle}>
            <GatherCards />
          </Card.Group>
        </Grid.Column>
        <Grid.Column textAlign="center" width={5} style={columnStyle}>
          <Header style={headerStyle}>
            <Icon name="search" />
            Explore
          </Header>

          <Card.Group style={cardGroupStyle}>
            <PlatformCards />
          </Card.Group>
        </Grid.Column>
        <Grid.Column textAlign="center" width={5} style={columnStyle}>
          <Header style={headerStyle}>
            <Icon name="student" />
            Donate
          </Header>
        </Grid.Column>
      </Grid>
    </div>
  );
};

export default DataSquare;
