import React, { useState, useRef, useEffect } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import { Container, Grid, Icon, Step } from "semantic-ui-react";
import background from "images/background.jpeg";
import BackButton from "components/routing/BackButton";
import DonationInformation from "./DonationInformation";
import BeforeYouDonate from "./BeforeYouDonate";
import ConfirmDonation from "./ConfirmDonation";
import ValidateData from "./ValidateData";

const DonationScreen = () => {
  const [step, setStep] = useState(0);
  const [doneValidation, setDoneValidation] = useState(false);
  const [doneRequest, setDoneRequest] = useState(false);

  const renderStep = () => {
    switch (step) {
      case 0:
        return <DonationInformation setStep={setStep} />;
      case 1:
        return <ValidateData done={doneValidation} setDone={setDoneValidation} setStep={setStep} />;
      case 2:
        return <BeforeYouDonate done={doneRequest} setDone={setDoneRequest} setStep={setStep} />;
      case 3:
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
            <DonationSteps
              step={step}
              setStep={setStep}
              doneValidation={doneValidation}
              doneRequest={doneRequest}
            />
            <div style={{ marginTop: "30px", height: "100%", width: "100%" }}>{renderStep()}</div>
          </Container>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const DonationSteps = ({ step, setStep, doneRequest }) => {
  const [maxStep, setMaxStep] = useState(0);
  //const maxStep = useRef(0);

  useEffect(() => {
    if (step > maxStep) setMaxStep(step);
  }, [step]);

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
          disabled={!doneRequest}
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
