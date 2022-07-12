import React from "react";
import { useTranslation } from "react-i18next";
import ReactMarkdown from "react-markdown";
import { Button, Grid, Header, Segment } from "semantic-ui-react";
import useLogger from "util/useLogger";

const DonationInformation = ({ setStep, settings }) => {
  useLogger("Donation screen - information");
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
            <ReactMarkdown linkTarget={"_blank"}>
              {settings?.donationInformation?.title?.trans}
            </ReactMarkdown>
          </Header>
          <ReactMarkdown linkTarget={"_blank"}>
            {settings?.donationInformation?.text?.trans}
          </ReactMarkdown>
          <Button fluid primary onClick={() => setStep(1)} style={{ maxHeight: "3em" }}>
            {t("donate.info.continue")}
          </Button>
        </Grid.Column>
      </Grid>
    </Segment>
  );
};

export default DonationInformation;
