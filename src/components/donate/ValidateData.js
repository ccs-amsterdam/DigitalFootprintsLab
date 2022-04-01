import db from "apis/db";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import QueryInput from "components/explore/dashboards/dashboardParts/QueryInput";
import Wordcloud from "components/explore/dashboards/dashboardParts/Wordcloud";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Button, Grid, Header, Segment, Step, List } from "semantic-ui-react";

const WORDCLOUD_COLORS = ["#564615", "#1f6175", "#421f7f"];

const ValidateData = ({ setStep, settings }) => {
  const [questions, setQuestions] = useState(null);

  useEffect(() => {
    if (!settings?.validateData) {
      setQuestions(null);
      return;
    }
    setQuestions(settings?.validateData);
  }, [settings]);

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
            <ValidateDataParts questions={questions} setOuterStep={setStep} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const ValidateDataParts = ({ questions, setOuterStep }) => {
  const [dataNames, setDataNames] = useState([]);
  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(0);
  const { t } = useTranslation();

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
            <Step
              key={dataName}
              active={i === step}
              onClick={() => setStep(i)}
              disabled={maxStep < i}
            >
              {dataName === "Browsing" ? <Icon name="history" /> : null}
              {dataName === "Search" ? <Icon name="search" /> : null}
              {dataName === "Youtube" ? <Icon name="youtube" /> : null}
              <Step.Content>{dataName}</Step.Content>
            </Step>
          );
        })}
      </Step.Group>
      <Header textAlign="center" as="h4">
        {t("donate.validate.header1")}
      </Header>
      <ValidateDataPart questions={questions} dataName={dataNames[step]} setStep={setStep} />
    </div>
  );
};

const ValidateDataPart = React.memo(({ questions, dataName, setStep }) => {
  const [validation, setValidation] = useState({});
  const [querySelection, setQuerySelection] = useState(null);
  const [allAnswered, setAllAnswered] = useState(false);
  const { t } = useTranslation();

  let field;
  if (dataName === "Browsing") field = "domain";
  if (dataName === "Search") field = "words";
  if (dataName === "Youtube") field = "channel";
  const dashData = useDashboardData(dataName);

  useEffect(() => {
    if (!dataName || !questions) {
      setValidation({});
      return;
    }

    db.getDataValidation(dataName)
      .then((v) => {
        const newv = {};
        for (let q of questions) {
          newv[q.question.value] = v?.[q.question.value];
        }
        setValidation(newv);
      })
      .catch((e) => {
        console.log(e);
        setValidation({});
      });
  }, [dataName, questions]);

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
            <i>Top {field}</i>
          </Header>
          <QueryInput dashData={dashData} setSelection={setQuerySelection} iconColor="black" />
          <div>
            <Wordcloud
              dashData={dashData}
              group={field}
              inSelection={querySelection}
              colors={WORDCLOUD_COLORS}
              unclickable={true}
            />
          </div>
        </Grid.Column>
        <Grid.Column textAlign="center" width={8}>
          <Header as="h3" style={{ paddingTop: "5px" }}>
            <Trans
              i18nKey="donate.validate.header2"
              values={{ dataname: dataName }}
              components={{ i: <i /> }}
            />
          </Header>
          <List
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <br />
            {Object.keys(validation).map((key) => {
              const question = questions.find((q) => q.question.value === key);
              return (
                <ValidationQuestion
                  key={key}
                  question={question}
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
                content={t("donate.validate.continue")}
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
  const answers = question?.answers.map((a) => a.value) || [];
  const trans_answers = question?.answers.map((a) => a.trans) || [];
  const trans_question = question?.question.trans || "";

  return (
    <List.Item key={dataName}>
      <br />
      <Header as="h4">{trans_question}</Header>
      <Button.Group fluid size="small" style={{ marginTop: "5px" }}>
        {answers.map((a, i) => {
          const selected = validation[question.question.value] === a;
          return (
            <Button
              key={a}
              onClick={async () => {
                const newValidation = { ...validation, [question.question.value]: a };
                await db.setDataValidation(newValidation, dataName);
                setValidation(newValidation);
              }}
              style={{
                padding: "7px 10px",
                background: selected ? "white" : "#555555",
                color: selected ? "#3b3a3a" : "white",
                borderRadius: "5px",
                border: selected ? "3px solid black" : "3px solid white",
              }}
            >
              {trans_answers[i]}
            </Button>
          );
        })}
      </Button.Group>
    </List.Item>
  );
};

export default ValidateData;
