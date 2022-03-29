import db from "apis/db";
import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  List,
  Loader,
  Segment,
  Dimmer,
} from "semantic-ui-react";
import submitData from "./submitData";

const ConfirmDonation = ({ settings }) => {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testUser, setTestUser] = useState(null);
  const { t } = useTranslation();

  const onClick = async () => {
    setLoading(true);
    await submitData(setStatus);
    setLoading(false);
  };

  useEffect(() => {
    db.isWelcome()
      .then((welcome) => {
        setTestUser(welcome?.userId === "test_user");
      })
      .catch((e) => {
        console.log(e);
      });
  });

  if (testUser === null) return null;

  return (
    <Segment
      style={{
        background: "white",
        height: "100%",
        color: "black",
        minHeight: "300px",
        overflow: "auto",
      }}
    >
      <Grid centered stackable verticalAlign="middle" style={{ height: "100%" }}>
        <Grid.Column width={8} stretched>
          <Header as="h2" style={{ textAlign: "center" }}>
            {t("donate.confirm.header")}
          </Header>
          <br />
          <ConsentForm settings={settings} setConsent={setConsent} />
          <br />
          {testUser ? (
            <Header textAlign="center" color="orange">
              {t("donate.confirm.testuser")}
            </Header>
          ) : (
            <br />
          )}
          <Button primary disabled={!consent || loading} onClick={onClick}>
            {t("donate.confirm.button")}
          </Button>
          <List>
            {status.map((file) => {
              return (
                <List.Item key={file.filename} style={{ marginLeft: "10%" }}>
                  <List.Icon
                    name={file.success ? "check circle outline" : "times circle outline"}
                    color={file.success ? "green" : "red"}
                  />
                  {file.success ? (
                    <List.Content>
                      <Trans
                        i18nKey="donate.confirm.donated.success"
                        values={{ n: file.n, filename: file.filename }}
                        components={{ b: <b /> }}
                      />
                    </List.Content>
                  ) : (
                    <List.Content>
                      <Trans
                        i18nKey="donate.confirm.donated.failure"
                        values={{ filename: file.filename }}
                        components={{ b: <b /> }}
                      />
                    </List.Content>
                  )}
                </List.Item>
              );
            })}
            <Segment style={{ border: "0", boxShadow: "none", marginTop: "20px" }}>
              <Dimmer inverted active={loading}>
                <Loader>{t("donate.confirm.loader")}</Loader>
              </Dimmer>
            </Segment>{" "}
          </List>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

//const consentItems = ["donate.confirm.consent1", "donate.confirm.consent2"];

const ConsentForm = ({ settings, setConsent }) => {
  const [consentArray, setConsentArray] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    if (!settings?.confirmDonation?.checkboxes) return;
    // could not be done directly in useState, but eventually this should be editable
    setConsentArray(new Array(settings?.confirmDonation?.checkboxes.length).fill(false));
  }, [settings]);

  useEffect(() => {
    let allConsent = consentArray.length > 0;
    for (let consent of consentArray) if (!consent) allConsent = false;
    setConsent(allConsent);
  }, [setConsent, consentArray]);

  console.log(settings);
  if (!settings?.confirmDonation?.checkboxes) return null;
  const consentItems = settings.confirmDonation.checkboxes.map((question) => question.trans);

  return (
    <Form>
      {consentItems.map((item, i) => {
        return (
          <ConsentItem
            key={item + i}
            content={t(item)}
            consent={consentArray[i]}
            setConsent={(checked) => {
              consentArray[i] = checked;
              setConsentArray([...consentArray]);
            }}
          />
        );
      })}
    </Form>
  );
};

const ConsentItem = ({ content, consent, setConsent }) => {
  return (
    <Form.Field>
      <Checkbox label={content} checked={consent} onChange={(e, d) => setConsent(d.checked)} />
    </Form.Field>
  );
};

export default ConfirmDonation;
