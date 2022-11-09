import db from "apis/db";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import React, { useEffect, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Icon, Button, Header, Segment, Step, List, Dimmer, Loader } from "semantic-ui-react";
import useLogger from "util/useLogger";
import { ValidationQuestion } from "types";

const ValidateData = ({ setStep, settings }) => {
  useLogger("Donation screen - validation");
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
      <div style={{ height: "100%", width: "100%" }}>
        <ValidateDataParts questions={questions} setOuterStep={setStep} />
      </div>
    </Segment>
  );
};

const ValidateDataParts = ({ questions, setOuterStep }) => {
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
    <div style={{ height: "100%", width: "100%" }}>
      <Step.Group size="mini" fluid unstackable>
        {dataNames.map((dataName, i) => {
          return (
            <Step
              key={dataName}
              active={i === step}
              onClick={() => setStep(i)}
              disabled={maxStep < i}
              style={{ padding: "10px 5px 10px 5px" }}
            >
              {dataName === "Browsing" ? <Icon size="mini" name="history" /> : null}
              {dataName === "Search" ? <Icon name="search" /> : null}
              {dataName === "Youtube" ? <Icon name="youtube" /> : null}
              <Step.Content>{i === step ? dataName : null}</Step.Content>
            </Step>
          );
        })}
      </Step.Group>
      {/* <Header textAlign="center" as="h3">
        <Trans
          i18nKey="donate.validate.header1"
          values={{ dataname: dataNames[step] }}
          components={{ i: <i /> }}
        />
      </Header> */}
      <ValidateDataPart questions={questions} dataName={dataNames[step]} setStep={setStep} />
    </div>
  );
};

interface ValidateDataPartProps {
  questions: ValidationQuestion[];
  dataName: string;
  setStep: any;
}

const ValidateDataPart = React.memo(({ questions, dataName, setStep }: ValidateDataPartProps) => {
  const [validation, setValidation] = useState({});
  //const [querySelection, setQuerySelection] = useState(null);
  const [allAnswered, setAllAnswered] = useState(false);
  const { t } = useTranslation();

  const dashData = useDashboardData(dataName);

  useEffect(() => {
    if (!dataName || !questions) {
      setValidation({});
      return;
    }

    db.getDataValidation(dataName)
      .then((v) => {
        const newv = {};
        for (const q of questions) {
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
    for (const answer of Object.values(validation)) {
      if (answer === null || answer == null) done = false;
    }
    setAllAnswered(done);
  }, [validation, setAllAnswered]);

  if (!dashData)
    return (
      <Dimmer active>
        <Loader />
      </Dimmer>
    );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", width: "100%" }}>
      <Dimmer active={validation == null || Object.keys(validation).length === 0}>
        <Loader />
      </Dimmer>
      <div style={{ width: "100%" }}></div>
      <div>
        <Header textAlign="center" as="h3" style={{ paddingTop: "15px" }}>
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
            marginTop: "0",
            height: "100%",
          }}
        >
          {Object.keys(validation).map((key) => {
            const question = questions.find((q) => q.question.value === key);
            return (
              <ValidationQuestionForm
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
      </div>
    </div>
  );
});

const ValidationQuestionForm = ({ question, validation, setValidation, dataName }) => {
  const answers = question?.answers.map((a) => a.value) || [];
  const trans_answers = question?.answers.map((a) => a.trans) || [];
  const trans_question = question?.question.trans || "";

  return (
    <List.Item key={dataName}>
      <br />
      <Header as="h4">{trans_question}</Header>
      <div style={{ marginTop: "5px", display: "flex" }}>
        {answers.map((a, i) => {
          const selected = validation[question.question.value] === a;
          return (
            <Button
              key={a}
              onClick={() => {
                const newValidation = { ...validation, [question.question.value]: a };
                db.setDataValidation(newValidation, dataName);
                setValidation(newValidation);
              }}
              style={{
                flex: "1 1 auto",
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
      </div>
    </List.Item>
  );
};

export default ValidateData;
