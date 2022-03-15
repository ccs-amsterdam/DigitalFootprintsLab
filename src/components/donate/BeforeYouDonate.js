import React from "react";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import AnnotateTopItems from "./AnnotationTasks/AnnotateTopItems";

const BeforeYouDonate = ({ done, setDone, setStep }) => {
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
        <Grid.Row>
          <Grid.Column width={16}>
            <Header as="h1" style={{ textAlign: "center" }}>
              Please answer the following questions
            </Header>
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
