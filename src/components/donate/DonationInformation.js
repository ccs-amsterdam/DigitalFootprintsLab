import React from "react";
import { Button, Grid, Header, Segment } from "semantic-ui-react";

const DonationInformation = ({ setStep }) => {
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
      <Grid verticalAlign="middle" centered stackable style={{ height: "100%" }}>
        <Grid.Column width={8}>
          <Header as="h2" style={{ textAlign: "center" }}>
            About donating your data
          </Header>
          <p>
            We probably need to tell participants a little story or something about how and for what
            purpose we'll use their data. Before the actual donation (in the 'Complete donation')
            step people will then need to verify that they have seen this and give consent.
          </p>
          <Button fluid primary onClick={() => setStep(1)} style={{ maxHeight: "3em" }}>
            Continue with donation
          </Button>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default DonationInformation;
