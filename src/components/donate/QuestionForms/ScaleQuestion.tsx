import { useState, useEffect } from "react";
import db from "apis/db";
import { Button, Grid, Popup } from "semantic-ui-react";

import { SetState, Question } from "../../../types";

interface ScaleQuestionProps {
  question: Question;
  setDone: SetState<boolean>;
}

const ScaleQuestion = ({ question, setDone }: ScaleQuestionProps) => {
  const [answers, setAnswers] = useState<string[]>(null);

  useEffect(() => {
    if (!question?.question?.value) return;

    db.getAnswers(question.question.value)
      .then((answers) => {
        setAnswers(answers || Array(question.items.length).fill(null));
      })
      .catch((e) => console.log(e));
  }, [question]);

  useEffect(() => {
    // check if all the items in the top have been annotated (if so, user is done with this question)
    if (!answers) return;
    let done = true;
    for (let answer of answers) if (answer === null) done = false;
    setDone(done);
  }, [answers, setDone]);

  const setAnswerForIndex = (answer, i) => {
    if (i >= answers.length) return null;
    answers[i] = answer;
    db.setAnswers(question.question.value, answers);
    setAnswers([...answers]);
  };

  return (
    <>
      <Grid.Row style={{ background: "#1678c2", color: "white", borderRadius: "5px" }}>
        <Grid.Column width={16} style={{ textAlign: "center" }}>
          <b>{question.question.trans}</b>
        </Grid.Column>
      </Grid.Row>

      {
        //Object.keys(data.annotations[question.field.value]).map((fieldvalue, i) => {
        (answers || []).map((answer, i) => {
          return (
            <ItemForm
              key={question?.items?.[i].value}
              item={question?.items?.[i].trans}
              answer={answer}
              setAnswer={(answer) => setAnswerForIndex(answer, i)}
              answerOptions={question?.answers}
              answerLabels={question?.answerLabels}
            />
          );
        })
      }
    </>
  );
};

const ItemForm = ({ item, answer, setAnswer, answerOptions, answerLabels }) => {
  return (
    <Grid.Row style={{ paddingTop: "7px", paddingBottom: "0px" }}>
      <Grid.Column width={16}>
        <div style={{ padding: "5px", textAlign: "center" }}>{item} </div>

        <Button.Group fluid size="mini">
          {answerOptions.map((a, i) => {
            console.log(answer);
            const active = answer === a.value;
            return (
              <Popup
                key={a.value + i}
                trigger={
                  <Button
                    key={a.value}
                    active={active}
                    onClick={() => {
                      setAnswer(a.value);
                    }}
                    style={{
                      padding: "8px 12px",
                      color: active ? "white" : "black",
                      background: active ? "#1678c2" : "#cce2ff",
                    }}
                  >
                    {answerLabels?.[i].trans || i + 1}
                  </Button>
                }
              >
                {a.trans}
              </Popup>
            );
          })}
        </Button.Group>
      </Grid.Column>
    </Grid.Row>
  );
};

export default ScaleQuestion;
