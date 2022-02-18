import React, { useEffect } from "react";

import db from "apis/db";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Header, Segment, Icon } from "semantic-ui-react";
import background from "images/background.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { setPersistent } from "actions";

/**
 * This component only appears the first time users visit,
 * or if they are away so long that the indexedDB has been cleaned.
 * In time, this page should clearly list the terms and conditions.
 */
const Welcome = ({ items }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistent = useSelector((state) => state.persistent);

  const beWelcomed = async (checkWelcome) => {
    if (checkWelcome) {
      const iswelcome = await db.isWelcome();
      if (!iswelcome?.persistent) dispatch(setPersistent(false));
      if (!iswelcome?.welcome) return null;
    }
    try {
      const persistent = await db.welcome();
      dispatch(setPersistent(persistent));
      navigate(items[0].path);
    } catch (e) {
      console.log("whut");
    }
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
          <div
            align="justified"
            style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px" }}
          >
            <h4 style={{ marginBottom: "8px" }}>Gather and explore your digital footprints</h4>
            <p>
              This application let's you collect and explore your own digital traces. All the data
              is stored and processed on your own device, so it <b>doesn't touch the internet</b>.
            </p>
            <h4 style={{ marginBottom: "8px" }}>Donate data to support academic research</h4>
            <p>
              You can also donate a selection of this data for scientific research. This data will
              only be used for <b>non-commercial research</b> by a select group of academics, for
              research that is approved by the ethical board of their university.
            </p>
            {persistent ? null : notPersistentMessage()}
          </div>
          <Button primary onClick={() => beWelcomed(false)}>
            Great, let's get started!
          </Button>
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const notPersistentMessage = () => {
  return (
    <>
      <h4 style={{ marginBottom: "8px" }}>
        <Icon color="orange" name="warning sign" /> If possible, use a different browser
      </h4>
      <p>
        This application works best in recent versions of Chrome, Safari, Edge, Firefox and Opera.
        For some browsers, like Firefox, it works better when not in private mode. You can still use
        the application with your current browser, but your data won't be stored if you leave. Don't
        worry though! you'll get a warning when you try to refresh or leave the page so this doesn't
        easily happen by accident.
      </p>
    </>
  );
};

export default Welcome;
