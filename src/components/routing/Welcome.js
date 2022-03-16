import React, { useEffect } from "react";

import db from "apis/db";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Header, Segment, Icon } from "semantic-ui-react";
import background from "images/background.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { setPersistent } from "actions";
import { useSearchParams } from "react-router-dom";

/**
 * This component only appears the first time users visit,
 * or if they are away so long that the indexedDB has been cleaned.
 */
const Welcome = ({ items }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistent = useSelector((state) => state.persistent);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");

  const beWelcomed = async (checkWelcome, userId) => {
    if (checkWelcome) {
      const iswelcome = await db.isWelcome();
      if (!iswelcome?.persistent) dispatch(setPersistent(false));
      if (!iswelcome?.welcome) return null;
      if (iswelcome.userId && userId !== null && iswelcome.userId !== userId) {
        // if a session was already started, but the user logs in with a new userId, delete the
        // previous session. This should very rarely pose a problem, and it prevents users accidentally
        // submitting data with the wrong user id.
        db.destroyEverything().then(() => {
          window.location.href += `?id=${userId}`;
        });
      }
    }
    try {
      const persistent = await db.welcome(userId ?? "test_user");
      dispatch(setPersistent(persistent));
      navigate(items[0].path);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    beWelcomed(true, userId);
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
            {userId === null ? testUserMessage() : null}
          </div>
          {welcomeButton(beWelcomed, userId)}
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

const testUserMessage = () => {
  return (
    <>
      <h4 style={{ marginBottom: "8px" }}>
        <Icon color="orange" name="warning sign" /> LOGGING IN AS TEST USER
      </h4>
      <p>
        The link that brought you to this website did not contain a user ID. If you are
        participating in a study, this should not be possible, and you should contact the
        researchers or survey company.
      </p>
      <p>
        As a test user your <i>real</i> data will not be send to a server. If you complete the data
        donation steps, the server will receive a dummy submission with fake data.
      </p>
    </>
  );
};

const welcomeButton = (beWelcomed, userId) => {
  if (userId === null)
    return (
      <Button
        primary
        onClick={() => beWelcomed(false, "test_user")}
        style={{ background: "#ff7300" }}
      >
        Log in as test user
      </Button>
    );
  return (
    <Button primary onClick={() => beWelcomed(false, userId)}>
      Great, let's get started!
    </Button>
  );
};

export default Welcome;
