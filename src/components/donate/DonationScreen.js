import React, { useState, useEffect } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import { Container, Grid, Icon, Step } from "semantic-ui-react";
import background from "images/background.jpeg";
import BackButton from "components/routing/BackButton";
import DonationInformation from "./DonationInformation";
import BeforeYouDonate from "./BeforeYouDonate";
import ConfirmDonation from "./ConfirmDonation";
import ValidateData from "./ValidateData";
import useLogger from "util/useLogger";

const DonationScreen = () => {
  const [step, setStep] = useState(0);
  const log = useLogger("Donationscreen", "open");

  const renderStep = () => {
    switch (step) {
      case 0:
        log("consent information page");
        return <DonationInformation setStep={setStep} />;
      case 1:
        log("validation page");
        return <ValidateData setStep={setStep} />;
      case 2:
        log("annotation page");
        return <BeforeYouDonate setStep={setStep} />;
      case 3:
        log("confirm page");
        return <ConfirmDonation />;
      default:
        return null;
    }
  };

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "calc(100vh - 38px)", width: "100vw" }}>
        <Grid.Column width={16}>
          <BackButton />
          <Container
            style={{
              height: "100%",
              marginTop: "70px",
              color: "white",
              fontSize: "1.5em",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <DonationSteps step={step} setStep={setStep} />
            <div style={{ marginTop: "30px", height: "100%", width: "100%" }}>{renderStep()}</div>
          </Container>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const DonationSteps = ({ step, setStep }) => {
  const [maxStep, setMaxStep] = useState(0);

  useEffect(() => {
    if (step > maxStep) setMaxStep(step);
  }, [step, maxStep]);

  const onClick = (i) => {
    if (i > maxStep) return;
    setStep(i);
  };

  return (
    <div>
      <Step.Group fluid>
        <Step active={step === 0} completed={step > 0} onClick={() => onClick(0)}>
          <Icon name="thumbs up" />
          <br />
          <Step.Content>
            <Step.Title>Informed consent</Step.Title>
            <Step.Description>What are you donating?</Step.Description>
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
            <Step.Title>Confirm data</Step.Title>
            <Step.Description>Is this your data?</Step.Description>
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
            <Step.Title>Before you donate</Step.Title>
            <Step.Description>One final request</Step.Description>
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
            <Step.Title>Complete donation</Step.Title>
            <Step.Description>Finalize the data donation</Step.Description>
          </Step.Content>
        </Step>
      </Step.Group>
    </div>
  );
};

export default DonationScreen;
