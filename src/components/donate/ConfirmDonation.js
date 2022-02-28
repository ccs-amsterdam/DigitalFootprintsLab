import React, { useState, useEffect } from "react";
import { Button, Checkbox, Form, Grid, Header, Segment } from "semantic-ui-react";

const ConfirmDonation = () => {
  const [consent, setConsent] = useState(false);

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
          <br />
          <Button primary disabled={!consent}>
            Donate your data
          </Button>
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
