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
        <Grid.Column width={10} doubling>
          <p style={{ fontSize: "1.3em" }}>{question?.question?.trans}</p>
        </Grid.Column>
        <Button.Group fluid size="small" style={{ marginTop: "10px" }}>
          {answerOptions.map((a, i) => {
            const selected = a.value === answer;
            return (
              <Button
                key={a.value}
                onClick={async () => {
                  await db.setAnswers(question.question.value, a.value);
                  setAnswer(a.value);
                }}
                style={{
                  padding: "10px 10px",
                  borderRadius: "5px",
                  //border: selected ? "3px solid black" : "3px solid white",
                  color: selected ? "white" : "black",
                  background: selected ? "#1678c2" : "#cce2ff",
                }}
              >
                {a.trans}
              </Button>
            );
          })}
        </Button.Group>
      </Grid.Row>
    </>
  );
};

export default SimpleQuestion;
