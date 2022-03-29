import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import AnnotateTopItems from "./AnnotationTasks/AnnotateTopItems";

const AnnotateData = ({ setStep, settings }) => {
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
            <AnnotateQuestions settings={settings} setDone={setDone} />
            {/* <AnnotateTopItems setDone={setDone} /> */}
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

const AnnotateQuestions = ({ settings, setDone }) => {
  const [questions, setQuestions] = useState(null);
  const [doneArray, setDoneArray] = useState(null);

  useEffect(() => {
    const questions = settings?.annotateData || [];
    const donearray = new Array(questions.length).fill(false);
    setDoneArray(donearray);
    setQuestions(questions);
  }, [settings]);

  useEffect(() => {
    if (doneArray === null) return;
    let allDone = true;
    for (let done of doneArray) if (!done) allDone = false;
    setDone(allDone);
  }, [doneArray, setDone]);

  console.log(questions);
  if (questions === null) return null;

  return (
    <>
      {questions.map((question, i) => {
        const updateDoneArray = (done) => {
          const newDoneArray = [...doneArray];
          if (newDoneArray[i] !== done) {
            newDoneArray[i] = done;
            setDoneArray(newDoneArray);
          }
        };

        if (question.type.value === "topItems") {
          return <AnnotateTopItems key={i} question={question} setDone={updateDoneArray} />;
        }
        return null;
      })}
    </>
  );
};

export default AnnotateData;
