import React, { useState, useEffect } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import { Container, Grid, Icon, Step } from "semantic-ui-react";
import background from "images/background.jpeg";
import DonationInformation from "./DonationInformation";
import AnswerQuestions from "./AnswerQuestions";
import ConfirmDonation from "./ConfirmDonation";
import ValidateData from "./ValidateData";
import useLogger from "util/useLogger";

import db from "apis/db";
import { useTranslation } from "react-i18next";
import MenuGridRow from "components/routing/MenuGridRow";
import useSettings from "util/useSettings";

const DonationScreen = () => {
  const [step, setStep] = useState(0);
  const log = useLogger("Donationscreen", "open");
  const settings = useSettings();

  const renderStep = () => {
    switch (step) {
      case 0:
        log("consent information page");
        return <DonationInformation setStep={setStep} settings={settings} />;
      case 1:
        log("validation page");
        return <ValidateData setStep={setStep} settings={settings} />;
      case 2:
        log("annotation page");
        return <AnswerQuestions setStep={setStep} settings={settings} />;
      case 3:
        log("confirm page");
        return <ConfirmDonation settings={settings} />;
      default:
        return null;
    }
  };

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "calc(100vh - 38px)", width: "100vw" }}>
        <MenuGridRow disabled />

        <Grid.Column width={16} style={{ height: "calc(100% - 50px)" }}>
          <Container
            style={{
              height: "100%",
              color: "white",
              fontSize: "1.5em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DonationSteps step={step} setStep={setStep} />
            <div style={{ marginTop: "30px", flex: "1 1 auto", overflow: "auto", width: "100%" }}>
              {renderStep()}
            </div>
          </Container>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const DonationSteps = ({ step, setStep }) => {
  const [maxStep, setMaxStep] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (step > maxStep) {
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

  return (
    <div style={{}}>
      <Step.Group fluid>
        <Step active={step === 0} completed={step > 0} onClick={() => onClick(0)}>
          <Icon name="thumbs up" />
          <br />
          <Step.Content>
            <Step.Title>{t("donate.step1.title")}</Step.Title>
            <Step.Description>{t("donate.step1.description")}</Step.Description>
          </Step.Content>
        </Step>
        <Step
          active={step === 1}
          completed={step > 1}
          disabled={maxStep < 1}
          onClick={() => onClick(1)}
        >
          <Icon name="address card outline" />
          <Step.Content>
            <Step.Title>{t("donate.step2.title")}</Step.Title>
            <Step.Description>{t("donate.step2.description")}</Step.Description>
          </Step.Content>
        </Step>
        <Step
          active={step === 2}
          completed={step > 2}
          disabled={maxStep < 2}
          onClick={() => onClick(2)}
        >
          <Icon name="clipboard" />
          <Step.Content>
            <Step.Title>{t("donate.step3.title")}</Step.Title>
            <Step.Description>{t("donate.step3.description")}</Step.Description>
          </Step.Content>
        </Step>
        <Step
          active={step === 3}
          completed={step > 3}
          disabled={maxStep < 3}
          onClick={() => onClick(3)}
        >
          <Icon name="student" />
          <Step.Content>
            <Step.Title>{t("donate.step4.title")}</Step.Title>
            <Step.Description>{t("donate.step4.description")}</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    </div>
  );
};

export default DonationScreen;
