import db from "apis/db";
import React, { useEffect, useState } from "react";
import { Button, Grid } from "semantic-ui-react";

const SimpleQuestion = ({ question, setDone }) => {
  const [answer, setAnswer] = useState(null);

  useEffect(() => {
    if (!question?.question?.value) return;
    db.getAnswers(question.question.value)
      .then(setAnswer)
      .catch((e) => console.log(e));
  }, [question]);

  useEffect(() => {
    if (answer !== null && answer != null) setDone(true);
  }, [answer, setDone]);

  const answerOptions = question?.answers || [];

  return (
    <>
      <Grid.Row>
        <Grid.Column width={16}>
          <p style={{ fontSize: "1em" }}>{question?.question?.trans}</p>
        </Grid.Column>
        <Grid.Column textAlign="center" width={15}>
          <Button.Group style={{ marginTop: "10px" }} vertical>
            {answerOptions.map((a) => {
              const selected = a.value === answer;
              return (
                <Button
                  key={a.value}
                  onClick={() => {
                    db.setAnswers(question.question.value, a.value);
                    setAnswer(a.value);
                  }}
                  style={{
                    borderRadius: "10px",
                    margin: "2px",
                    color: selected ? "white" : "black",
                    background: selected ? "#1678c2" : "#cce2ff",
                  }}
                >
                  {a.trans}
                </Button>
              );
            })}
          </Button.Group>
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

export default SimpleQuestion;
