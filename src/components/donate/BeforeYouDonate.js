import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import AnnotateTopItems from "./AnnotationTasks/AnnotateTopItems";

const BeforeYouDonate = ({ setStep }) => {
  const [done, setDone] = useState(false);
  const { t } = useTranslation();

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
              {t("donate.annotate.header")}
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
              onClick={() => setStep(3)}
              style={{ maxHeight: "3em" }}
            >
              {done ? t("donate.annotate.continue") : t("donate.annotate.pleaseanswer")}
            </Button>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

export default BeforeYouDonate;
