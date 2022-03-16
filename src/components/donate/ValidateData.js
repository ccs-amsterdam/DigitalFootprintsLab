import db from "apis/db";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import QueryInput from "components/explore/dashboards/dashboardParts/QueryInput";
import Wordcloud from "components/explore/dashboards/dashboardParts/Wordcloud";
import React, { useEffect, useState } from "react";
import { Icon, Button, Grid, Header, Segment, Step, List } from "semantic-ui-react";

const ValidateData = ({ setStep }) => {
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
            <ValidateDataParts setOuterStep={setStep} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const ValidateDataParts = ({ setOuterStep }) => {
  const [dataNames, setDataNames] = useState([]);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);

  useEffect(() => {
    db.idb.data
      .toCollection()
      .keys()
      .then(setDataNames)
      .catch((e) => {
        console.log(e);
        setDataNames([]);
      });
  }, [setDataNames]);

  useEffect(() => {
    if (step > maxStep) setMaxStep(step);
    if (dataNames.length && step >= dataNames.length) {
      setOuterStep((outerstep) => outerstep + 1);
    }
  }, [step, maxStep, dataNames, setOuterStep]);

  return (
    <div>
      <Step.Group fluid>
        {dataNames.map((dataName, i) => {
          return (
            <Step active={i === step} onClick={() => setStep(i)} disabled={maxStep < i}>
              {dataName === "Browsing" ? <Icon name="history" /> : null}
              {dataName === "Search" ? <Icon name="search" /> : null}
              {dataName === "Youtube" ? <Icon name="youtube" /> : null}
              <Step.Content>{dataName}</Step.Content>
            </Step>
          );
        })}
      </Step.Group>
      <Header textAlign="center" as="h4">
        To use your data for research, it's important to know how accurate it is. Please help us by
        answering a few questions about your data
      </Header>
      <ValidateDataPart dataName={dataNames[step]} setStep={setStep} />
    </div>
  );
};

const colors = ["#564615", "#1f6175", "#421f7f"];
const questions = [
  {
    question: "Do you feel that you recognize this digital footprint as your own?",
    answers: ["not at all", "very little", "somewhat", "quite a bit", "a great deal"],
  },
  {
    question: "Are the largest items indeed the items you often visit?",
    answers: ["not at all", "very little", "somewhat", "quite a bit", "a great deal"],
  },
  {
    question: "Are there any items that you know you visited often, but are not shown here?",
    answers: ["none missing", "some missing", "quite a lot missing", "most missing"],
  },
  {
    question: "Is this data only yours, or does someone else use your device or account?",
    answers: ["Only me", "Mostly me", "Mostly someone else"],
  },
];

const ValidateDataPart = React.memo(({ dataName, setStep }) => {
  const [validation, setValidation] = useState({});
  const [querySelection, setQuerySelection] = useState(null);
  const [allAnswered, setAllAnswered] = useState(false);

  let field;
  if (dataName === "Browsing") field = "domain";
  if (dataName === "Search") field = "word";
  if (dataName === "Youtube") field = "channel";
  const dashData = useDashboardData(dataName);

  useEffect(() => {
    if (!dataName) {
      setValidation({});
      return;
    }
    db.getDataValidation(dataName)
      .then((v) => {
        const newv = {};
        for (let q of questions) {
          newv[q.question] = v?.[q.question];
        }
        setValidation(newv);
      })
      .catch((e) => {
        console.log(e);
        setValidation({});
      });
  }, [dataName]);

  useEffect(() => {
    let done = true;
    for (let answer of Object.values(validation)) {
      if (answer === null || answer == null) done = false;
    }
    setAllAnswered(done);
  }, [validation, setAllAnswered]);

  if (!dashData) return null;
  return (
    <Grid style={{ width: "100%" }}>
      <Grid.Row>
        <Grid.Column textAlign="center"></Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign="center" width={8} style={{ width: "100%", overflow: "auto" }}>
          <Header>
            <i>Top {field}s</i>
          </Header>
          <QueryInput dashData={dashData} setSelection={setQuerySelection} iconColor="black" />
          <div>
            <Wordcloud
              dashData={dashData}
              group={field}
              inSelection={querySelection}
              colors={colors}
              unclickable={true}
            />
          </div>
        </Grid.Column>
        <Grid.Column textAlign="center" width={8}>
          <Header as="h3" style={{ paddingTop: "5px" }}>
            On the left you see the top items in your <i>{dataName}</i> data. Please answer the
            following questions to help us understand how accurate this data.
          </Header>
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <br />
            {Object.keys(validation).map((q) => {
              return (
                <ValidationQuestion
                  question={q}
                  validation={validation}
                  setValidation={setValidation}
                  dataName={dataName}
                />
              );
            })}
            <br />
            <List.Item>
              <Button
                fluid
                primary
                disabled={!allAnswered}
                content="CONTINUE"
                onClick={() => setStep((step) => step + 1)}
              />
            </List.Item>
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

const ValidationQuestion = ({ question, validation, setValidation, dataName }) => {
  const answers = questions.find((q) => q.question === question)?.answers || [];

  return (
    <List.Item key={dataName}>
      <br />
      <Header as="h4">{question}</Header>
      <Button.Group fluid size="small">
        {answers.map((a, i) => {
          const selected = validation[question] === a;
          return (
            <Button
              key={a}
              onClick={() => {
                const newValidation = { ...validation, [question]: a };
                db.setDataValidation(newValidation, dataName);
                setValidation(newValidation);
              }}
              style={{
                padding: "4px 10px",
                background: selected ? "white" : "#3b3a3a",
                color: selected ? "#3b3a3a" : "white",
                borderRadius: "5px",
                border: selected ? "3px solid black" : "3px solid white",
              }}
            >
              {a}
            </Button>
          );
        })}
      </Button.Group>
    </List.Item>
  );
};

export default ValidateData;
