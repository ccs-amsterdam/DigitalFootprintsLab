import React, { useEffect, useState } from "react";

import db from "apis/db";
import { useNavigate } from "react-router-dom";
import { Button, Header, Segment, Icon, Input, Grid, Divider } from "semantic-ui-react";
import background from "images/background.jpeg";
import { useDispatch, useSelector } from "react-redux";
import { setPersistent } from "actions";
import { useSearchParams } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import { urlParamString } from "util/tools";

/**
 * This component only appears the first time users visit,
 * or if they are away so long that the indexedDB has been cleaned.
 */
const Welcome = ({ items }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const persistent = useSelector((state: any) => state.persistent);
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const returnURL = searchParams.get("return");

  const checkIfWelcome = async (userId, returnURL) => {
    const iswelcome = await db.isWelcome();
    if (!iswelcome?.persistent) dispatch(setPersistent(false));
    if (!iswelcome?.welcome) return null;
    if (iswelcome.userId && userId !== null && iswelcome.userId !== userId) {
      // if a session was already started, but the user logs in with a new userId, delete the
      // previous session. This should very rarely pose a problem, and it prevents users accidentally
      // submitting data with the wrong user id.
      db.destroyEverything().then(() => {
        const paramString = urlParamString({ id: userId, return: returnURL });
        window.location.href += paramString;
      });
    }
    navigate(items[0].path);
  };

  const beWelcomed = async (userId, returnURL) => {
    try {
      const persistent = await db.welcome(userId ?? "test_user", returnURL);
      dispatch(setPersistent(persistent));
      navigate(items[0].path);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    checkIfWelcome(userId, returnURL);
  });

  return (
    <div
      style={{
        textAlign: "center",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        width: "100%",
        backgroundImage: `url(${background})`,
        backgroundSize: "100% 100%",
      }}
    >
      <Segment
        style={{
          position: "relative",
          margin: "auto",
          maxHeight: "calc(100% - 40px)",
          width: "680px",
          maxWidth: "calc(100vw - 40px)",
          overflow: "auto",
          border: "2px solid grey",
          boxShadow: "8px 10px #0f0f0f82",
        }}
      >
        <Header as="h2">{t("routing.welcome.header")}</Header>
        <div style={{ textAlign: "left", marginTop: "20px", marginBottom: "20px" }}>
          <h4 style={{ marginBottom: "8px" }}>{t("routing.welcome.subheader1")}</h4>
          <p>
            <Trans i18nKey="routing.welcome.p1" components={{ b: <b /> }} />
          </p>
          <h4 style={{ marginBottom: "8px" }}>{t("routing.welcome.subheader2")}</h4>
          <p>
            <Trans i18nKey="routing.welcome.p2" components={{ b: <b /> }} />
          </p>
          {persistent ? null : notPersistentMessage(t)}
          {userId === null ? noIdMessage(t) : null}
        </div>
        <WelcomeButton t={t} beWelcomed={beWelcomed} userId={userId} returnURL={returnURL} />
      </Segment>
    </div>
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

const noIdMessage = (t) => {
  return (
    <>
      <h4 style={{ marginBottom: "8px" }}>
        <Icon color="orange" name="warning sign" /> {t("routing.welcome.noid.header")}
      </h4>
      <p>{t("routing.welcome.noid.p1")}</p>
      <p>{t("routing.welcome.noid.p2")}</p>
    </>
  );
};

const WelcomeButton = ({ t, beWelcomed, userId, returnURL }) => {
  const [customID, setCustomID] = useState('');

  if (userId === null)
    return (
      <Grid columns={2} textAlign="center" verticalAlign="middle">
        <Grid.Column width={16}>
          <Input
            value={customID}
            onChange={(e, d) => setCustomID(d.value)}
            placeholder={t("routing.welcome.noid.placeholder")}
            attached="left"
          />
          <Button
            disabled={!customID}
            attached="right"
            primary
            onClick={() => beWelcomed(customID, returnURL)}
          >
            {t("routing.welcome.noid.customid")}
          </Button>
        </Grid.Column>
        <Divider horizontal>Or</Divider>
        <Grid.Column width={16}>
          <Button
            attached="right"
            primary
            onClick={() => beWelcomed("test_user", returnURL)}
            style={{ background: "#ff7300" }}
          >
            {t("routing.welcome.noid.testuser")}
          </Button>
        </Grid.Column>
      </Grid>
    );
  return (
    <Button primary onClick={() => beWelcomed(userId, returnURL)}>
      {t("routing.welcome.button")}
    </Button>
  );
};

export default Welcome;
