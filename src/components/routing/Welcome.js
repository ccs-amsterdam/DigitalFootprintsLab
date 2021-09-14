import React, { useEffect } from "react";

import db from "apis/dexie";
import { useHistory } from "react-router-dom";
import { Grid, Button, Header, Segment } from "semantic-ui-react";
import background from "images/background.jpeg";

/**
 * This component only appears the first time users visit,
 * or if they are away so long that the indexedDB has been cleaned.
 * In time, this page should clearly list the terms and conditions.
 */
const Welcome = ({ items }) => {
  const history = useHistory();

  const beWelcomed = async (checkWelcome) => {
    if (checkWelcome) {
      const iswelcome = await db.isWelcome();
      if (!iswelcome) return null;
    }
    try {
      await db.welcome();
      history.push(items[0].path);
    } catch (e) {}
  };

  useEffect(() => {
    beWelcomed(true);
  });

  return (
    <Grid
      inverted
      textAlign="center"
      style={{
        height: "100vh",
        backgroundImage: `url(${background})`,
        backgroundSize: "100% 100%",
      }}
      verticalAlign="middle"
    >
      <Grid.Column style={{ maxWidth: 600 }}>
        <Segment style={{ border: 0 }}>
          <Header as="h2">Welcome to the Digital Footprints Lab!</Header>
          <p align="justified">
            This application let's you collect and explore your own digital traces. All the data is
            stored and processed on your own device, and cannot be seen by anyone, so that you are
            free to contemplate your life choices in solitude.
          </p>
          <p align="justified">
            We do, however, kindly ask you to anonymously donate some parts of this data for
            scientific research. Specifically, we are interested in how you seek, consume and share
            news articles. The data will be used for non-commercial research by a select group of
            researchers at Dutch Universities.
          </p>
          <Button primary onClick={() => beWelcomed(false)}>
            Great, let's get started!
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

export default Welcome;
