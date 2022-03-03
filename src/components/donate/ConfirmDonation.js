import db from "apis/db";
import React, { useState, useEffect } from "react";
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

const ConfirmDonation = () => {
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [testUser, setTestUser] = useState(null);

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
            Please confirm that you understand and agree with the following conditions
          </Header>
          <br />
          <ConsentForm setConsent={setConsent} />
          <br />
          {testUser ? (
            <Header textAlign="center" color="orange">
              You are logged in as a test user, so your real data won't be submitted. The server
              will only see what types of data you submitted, and how many items
            </Header>
          ) : (
            <br />
          )}
          <Button primary disabled={!consent || loading} onClick={onClick}>
            Donate your data
          </Button>
          <List>
            {status.map((file) => {
              console.log(file);
              return (
                <List.Item key={file.filename} style={{ marginLeft: "10%" }}>
                  <List.Icon
                    name={file.success ? "check circle outline" : "times circle outline"}
                    color={file.success ? "green" : "red"}
                  />
                  {file.success ? (
                    <List.Content>
                      Donated {file.n} <b>{file.filename}</b> items{" "}
                      <i style={{ color: "darkgrey" }}></i>
                    </List.Content>
                  ) : (
                    <List.Content>
                      Failed to submit <b>{file.filename} </b> data. Please try again, and contact
                      the researchers or survey company if the problem persists
                    </List.Content>
                  )}
                </List.Item>
              );
            })}
            <Segment style={{ border: "0", boxShadow: "none", marginTop: "20px" }}>
              <Dimmer inverted active={loading}>
                <Loader>Uploading files</Loader>
              </Dimmer>
            </Segment>{" "}
          </List>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

const consentItems = [
  "I have seen that I can search and delete items from my data, and understand that all items that have not been deleted will be submitted for donation",
  "I have seen the explanation of how and for what purpose my data will be used, and give my consent to use it for this purpose",
];

const ConsentForm = ({ setConsent }) => {
  const [consentArray, setConsentArray] = useState([]);

  useEffect(() => {
    // could not be done directly in useState, but eventually this should be editable
    setConsentArray(new Array(consentItems.length).fill(false));
  }, []);

  useEffect(() => {
    let allConsent = true;
    for (let consent of consentArray) if (!consent) allConsent = false;
    setConsent(allConsent);
  }, [setConsent, consentArray]);

  return (
    <Form>
      {consentItems.map((item, i) => {
        return (
          <ConsentItem
            key={item}
            content={item}
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
