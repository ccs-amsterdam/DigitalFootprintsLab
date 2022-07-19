import { Grid, Segment } from "semantic-ui-react";
import { useLocation } from "react-router-dom";
import { gatherSettings } from "project/gatherSettings";
import { useTranslation } from "react-i18next";
import GatherSteps from "./GatherSteps";

const GatherScreen = () => {
  const { t, i18n } = useTranslation();
  const language = i18n?.language.split("-")[0];
  const location = useLocation();
  const platformPath = location.pathname.split("/").slice(-1)[0];
  const platform = gatherSettings.find((gs) => gs.name.replace(" ", "_") === platformPath);

  const instruction = platform?.instructions?.[language] || platform?.instructions?.default;

  return (
    <div style={{ height: "100%", width: "100%", background: "#000000b0" }}>
      <Grid
        centered
        stackable
        style={{
          height: "100%",
          margin: "0",
          padding: "10px 5px 10px 5px",
          width: "100%",
        }}
      >
        <Grid.Column
          width="16"
          style={{
            height: "100%",
            maxWidth: "800px",
            paddingBottom: "0px",
            paddingTop: "0px",
          }}
        >
          <Segment style={{ height: "100%", overflow: "auto" }}>
            <GatherSteps t={t} platform={platform} instruction={instruction} />
          </Segment>
        </Grid.Column>
        {/* <Grid.Column width={6} style={{ height: "calc(100% - 40px)" }}>
          <Segment style={segmentStyle}>
            <ImportData t={t} platform={platform} instruction={instruction} setFiles={setFiles} />
            <Dimmer active={loading}>
              <Loader />
            </Dimmer>
          </Segment>
        </Grid.Column> */}
      </Grid>
    </div>
  );
};

export default GatherScreen;
