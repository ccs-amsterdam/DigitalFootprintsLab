import db from "apis/db";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import Wordcloud from "components/explore/dashboards/dashboardParts/Wordcloud";
import React, { useEffect, useState } from "react";
import { Popup, Icon, Button, Grid, Header, Segment, Step, List } from "semantic-ui-react";

const ValidateData = ({ done, setDone, setStep }) => {
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
              About this data
            </Header>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column width={10}>
            <p>
              To use your data for research, it's important to know how accurate it is. We ask you
              to help us by answering a few questions about your data
            </p>
            <br />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={16}>
            <ValidateDataParts />
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

const ValidateDataParts = () => {
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
  }, [step, maxStep]);

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
      <ValidateDataPart dataName={dataNames[step]} />
    </div>
  );
};

const colors = ["#564615", "#1f6175", "#421f7f"];
const validationQuestions = [
  "This data appears accurate. The top items shown here are what I expected to find",
  "This data appears complete. There are few items missing that I expected to find",
  "This data is mostly mine. Not a friend or family member using my device",
];
const answerLabels = [
  "Strongly Disagree",
  "Disagree",
  "Somewhat Disagree",
  "Neither Agree nor Disagree",
  "Somewhat Agree",
  "Agree",
  "Strongly Agree",
];

const ValidateDataPart = React.memo(({ dataName }) => {
  const [validation, setValidation] = useState({});

  let field;
  if (dataName === "Browsing") field = "domain";
  if (dataName === "Search") field = "word";
  if (dataName === "Youtube") field = "channel";
  const dashData = useDashboardData(dataName);

  useEffect(() => {
    db.getDataValidation(dataName)
      .then((v) => setValidation(v || {}))
      .catch((e) => {
        console.log(e);
        setValidation({});
      });
  }, [dataName]);

  if (!dashData) return null;
  return (
    <Grid style={{ width: "100%" }}>
      <Grid.Row>
        <Grid.Column textAlign="center">
          <Header as="h2" style={{ paddingTop: "5px" }}>
            How strongly do you agree with the following statements about your <i>{dataName}</i>{" "}
            data?
          </Header>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column textAlign="center" width={8} style={{ width: "100%", overflow: "auto" }}>
          <Header>
            <i>Top {field}s</i>
          </Header>
          <div>
            <Wordcloud
              dashData={dashData}
              group={field}
              setOutSelection={(d) => console.log(d)}
              colors={colors}
              unclickable={true}
            />
          </div>
        </Grid.Column>
        <Grid.Column
          textAlign="center"
          width={8}
          style={{ display: "flex", flexDirection: "column", justifyContent: "space-around" }}
        >
          <br />
          <List>
            {validationQuestions.map((q) => {
              return (
                <ValidationQuestion
                  question={q}
                  validation={validation}
                  setValidation={setValidation}
                />
              );
            })}
          </List>
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
});

const buttonColors = ["#930b0b", "#933b0b", "#93580b", "#937f0b", "#81930b", "#68930b", "#3b930b"];

const ValidationQuestion = ({ question, validation, setValidation }) => {
  console.log(validation);
  console.log(validation[question]);

  return (
    <List.Item>
      <br />
      <Header as="h4">{question}</Header>
      <Button.Group fluid size="small" style={{ paddingTop: "4px" }}>
        {answerLabels.map((a, i) => {
          const selected = validation[question] === a;
          return (
            <Popup
              key={a + i}
              trigger={
                <Button
                  key={a}
                  onClick={() => {
                    setValidation({ ...validation, [question]: a });
                  }}
                  style={{
                    padding: "4px 10px",
                    background: buttonColors[i],
                    color: "white",
                    border: selected ? "3px solid black" : "3px solid white",
                  }}
                >
                  {i + 1}
                </Button>
              }
            >
              {a}
            </Popup>
          );
        })}
      </Button.Group>
    </List.Item>
  );
};

export default ValidateData;
