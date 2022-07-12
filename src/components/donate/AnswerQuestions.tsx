import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Divider, Grid, Header, Segment } from "semantic-ui-react";
import useLogger from "util/useLogger";
import AnnotateTopItems from "./QuestionForms/AnnotateTopItems";
import SimpleQuestion from "./QuestionForms/SimpleQuestion";

const AnswerQuestions = ({ setStep, settings }) => {
  useLogger("Donation screen - questions");
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
      <Grid centered stackable style={{ height: "100%" }}>
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
    const questions = settings?.answerQuestions || [];
    const donearray = new Array(questions.length).fill(false);
    setDoneArray(donearray);
    setQuestions(questions);
  }, [settings]);

  useEffect(() => {
    if (doneArray === null) return;
    let allDone = true;
    for (const done of doneArray) if (!done) allDone = false;
    setDone(allDone);
  }, [doneArray, setDone]);

  const renderQuestion = (question, i) => {
    const updateDoneArray = (done) => {
      const newDoneArray = [...doneArray];
      if (newDoneArray[i] !== done) {
        newDoneArray[i] = done;
        setDoneArray(newDoneArray);
      }
    };

    if (question.type.value === "topItems") {
      return (
        <AnnotateTopItems
          key={question.question.value}
          question={question}
          setDone={updateDoneArray}
        />
      );
    }
    if (question.type.value === "simpleQuestion") {
      return (
        <SimpleQuestion
          key={question.question.value}
          question={question}
          setDone={updateDoneArray}
        />
      );
    }
    return null;
  };

  if (questions === null) return null;
  return questions.map((question, i) => {
    return (
      <Grid key={question?.question?.value + i} centered stackable>
        {i > 0 ? <Divider style={{ margin: "40px", width: "100%" }} /> : null}
        <Grid.Row>
          <Grid.Column width={10}>
            <Header as="h1" textAlign="center">
              {question?.title?.trans}
            </Header>
            {question?.intro?.trans ? <p>{question.intro.trans}</p> : null}
          </Grid.Column>
        </Grid.Row>
        {renderQuestion(question, i)}
      </Grid>
    );
  });
};

export default AnswerQuestions;
