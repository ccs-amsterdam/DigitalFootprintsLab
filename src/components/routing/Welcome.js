import React, { useEffect } from "react";

import db from "apis/db";
import { useNavigate } from "react-router-dom";
import { Grid, Button, Header, Segment, Icon } from "semantic-ui-react";
import background from "images/background.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { setPersistent } from "actions";
import { useSearchParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";

/**
 * This component only appears the first time users visit,
 * or if they are away so long that the indexedDB has been cleaned.
 */
const Welcome = ({ items }) => {
  const { t } = useTranslation();
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
        overflow: "auto",
      }}
      verticalAlign="middle"
    >
      <Grid.Column style={{ maxWidth: 600 }}>
        <Segment style={{ border: 0 }}>
          <Header as="h2">{t("routing.welcome.header")}</Header>
          <div
            align="justified"
            style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px" }}
          >
            <h4 style={{ marginBottom: "8px" }}>{t("routing.welcome.subheader1")}</h4>
            <p>
              <Trans i18nKey="routing.welcome.p1" components={{ b: <b /> }} />
            </p>
            <h4 style={{ marginBottom: "8px" }}>{t("routing.welcome.subheader2")}</h4>
            <p>
              <Trans i18nKey="routing.welcome.p2" components={{ b: <b /> }} />
            </p>
            {persistent ? null : notPersistentMessage(t)}
            {userId === null ? testUserMessage(t) : null}
          </div>
          {welcomeButton(t, beWelcomed, userId)}
        </Segment>
      </Grid.Column>
    </Grid>
  );
};

const notPersistentMessage = (t) => {
  return (
    <>
      <h4 style={{ marginBottom: "8px" }}>
        <Icon color="orange" name="warning sign" /> {t("routing.welcome.notpersistent.header")}
      </h4>
      <p>{t("routing.welcome.notpersistent.p")}</p>
    </>
  );
};

const testUserMessage = (t) => {
  return (
    <>
      <h4 style={{ marginBottom: "8px" }}>
        <Icon color="orange" name="warning sign" /> {t("routing.welcome.testuser.header")}
      </h4>
      <p>{t("routing.welcome.testuser.p1")}</p>
      <p>{t("routing.welcome.testuser.p2")}</p>
    </>
  );
};

const welcomeButton = (t, beWelcomed, userId) => {
  if (userId === null)
    return (
      <Button
        primary
        onClick={() => beWelcomed(false, "test_user")}
        style={{ background: "#ff7300" }}
      >
        {t("routing.welcome.testuser.button")}
      </Button>
    );
  return (
    <Button primary onClick={() => beWelcomed(false, userId)}>
      {t("routing.welcome.button")}
    </Button>
  );
};

export default Welcome;
