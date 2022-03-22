import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Grid, Header, Segment } from "semantic-ui-react";

const DonationInformation = ({ setStep }) => {
  const { t } = useTranslation();
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
        <Grid.Column width={8}>
          <Header as="h2" style={{ textAlign: "center" }}>
            {t("donate.info.header")}
          </Header>
          <p>{t("donate.info.p1")}</p>
          <Button fluid primary onClick={() => setStep(1)} style={{ maxHeight: "3em" }}>
            {t("donate.info.continue")}
          </Button>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default DonationInformation;
