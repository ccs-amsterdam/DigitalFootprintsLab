import { useState, useEffect, useCallback } from "react";
import { Icon, Step } from "semantic-ui-react";
import DonationInformation from "./DonationInformation";
import AnswerQuestions from "./AnswerQuestions";
import ConfirmDonation from "./ConfirmDonation";
import ValidateData from "./ValidateData";

import db from "apis/db";
import { useTranslation } from "react-i18next";
import useSettings from "util/useSettings";

const DonationScreen = () => {
  const [step, setStep] = useState(null);
  const settings = useSettings();

  const renderStep = useCallback(
    (step) => {
      switch (step) {
        case 0:
          return <DonationInformation setStep={setStep} settings={settings} />;
        case 1:
          return <ValidateData setStep={setStep} settings={settings} />;
        case 2:
          return <AnswerQuestions setStep={setStep} settings={settings} />;
        case 3:
          return <ConfirmDonation settings={settings} />;
        default:
          return null;
      }
    },
    [settings]
  );

  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        background: "#000000b0",
        padding: "1vmin",
        display: "flex",
      }}
    >
      <div
        style={{
          margin: "auto",
          height: "100%",
          color: "white",
          fontSize: "1em",
          display: "flex",
          width: "800px",
          maxWidth: "100%",
          flexDirection: "column",
        }}
      >
        <DonationSteps step={step} setStep={setStep} />
        <div
          style={{
            paddingTop: "5px",
            flex: "1 1 auto",
            overflow: "auto",
            width: "100%",
            fontSize: "clamp(0.8em, 1vw, 1em)",
          }}
        >
          {renderStep(step)}
        </div>
      </div>
    </div>
  );
};

const DonationSteps = ({ step, setStep }) => {
  const [maxStep, setMaxStep] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (step !== null && step > maxStep) {
      setMaxStep(step);
      db.setDonationStep(step);
    }
  }, [step, maxStep]);

  useEffect(() => {
    db.getDonationStep()
      .then(setStep)
      .catch((e) => console.log(e));
  }, [setStep]);

  const onClick = (i) => {
    if (i > maxStep) return;
    setStep(i);
  };

  const stepStyle = {
    padding: "10px min(max(1vw, 3px),20px)",
    fontSize: "min(max(1vw, 0.5em), 0.8em)",
  };

  return (
    <div style={{ fontSize: "1.3em" }}>
      <Step.Group unstackable fluid style={{ overflow: "auto" }}>
        <Step active={step === 0} onClick={() => onClick(0)} style={stepStyle}>
          <Icon name="thumbs up" />
          <Step.Content style={{ display: step === 0 ? "" : "none" }}>
            <Step.Title>{t("donate.step1.title")}</Step.Title>
          </Step.Content>
        </Step>
        <Step
          active={step === 1}
          disabled={maxStep < 1}
          onClick={() => onClick(1)}
          style={stepStyle}
        >
          <Icon name="address card outline" />
          <Step.Content style={{ display: step === 1 ? "" : "none" }}>
            <Step.Title>{t("donate.step2.title")}</Step.Title>
          </Step.Content>
        </Step>
        <Step
          active={step === 2}
          disabled={maxStep < 2}
          onClick={() => onClick(2)}
          style={stepStyle}
        >
          <Icon name="clipboard" />
          <Step.Content style={{ display: step === 2 ? "" : "none" }}>
            <Step.Title>{t("donate.step3.title")}</Step.Title>
          </Step.Content>
        </Step>
        <Step
          active={step === 3}
          disabled={maxStep < 3}
          onClick={() => onClick(3)}
          style={stepStyle}
        >
          <Icon name="student" />
          <Step.Content style={{ display: step === 3 ? "" : "none" }}>
            <Step.Title>{t("donate.step4.title")}</Step.Title>
          </Step.Content>
        </Step>
      </Step.Group>
    </div>
  );
};

export default DonationScreen;
