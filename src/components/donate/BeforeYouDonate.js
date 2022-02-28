import React, { useState } from "react";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import AnnotateTopItems from "./AnnotationTasks/AnnotateTopItems";

const BeforeYouDonate = ({ setStep }) => {
  const [done, setDone] = useState(false);

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
      <Grid centered stackable style={{ height: "100%" }}>
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" style={{ textAlign: "center" }}>
              Before submitting your data, we have one final request
            </Header>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <p>
              Below you see <b>your top 10 YouTube channels</b>. To help us understand whether and
              how YouTube is used as a news source, please let us know to what extent you yourself
              consider these channels to be informative.
            </p>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14}>
            <AnnotateTopItems setDone={setDone} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={8}>
            <Button
              disabled={!done}
              fluid
              primary
              onClick={() => setStep(2)}
              style={{ maxHeight: "3em" }}
            >
              {done ? `Continue with donation` : `Please answer all questions to continue`}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default BeforeYouDonate;
