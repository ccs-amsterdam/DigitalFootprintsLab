import React, { useState, useEffect } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import { Dimmer, Grid, Loader, Segment } from "semantic-ui-react";
import background from "images/background.jpeg";
import BackButton from "components/routing/BackButton";
import GatherButtons from "components/routing/GatherButtons";
import useLogger from "util/useLogger";
import { useLocation, useNavigate } from "react-router-dom";
import { gatherSettings } from "project/project";
import StepwiseInstructions from "./StepwiseInstructions";
import { useTranslation } from "react-i18next";
import ImportData from "./ImportData";
import { useDispatch } from "react-redux";
import { miseEnPlace } from "data-donation-importers";
import db from "apis/db";

const segmentStyle = {
  background: "white",
  height: "100%",
  color: "black",
  minHeight: "300px",
};

const GatherScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const log = useLogger("Gatherscreen", "open");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation();
  const language = i18n?.language.split("-")[0];
  const location = useLocation();
  const platformPath = location.pathname.split("/").slice(-1)[0];
  const platform = gatherSettings.find((gs) => gs.name.replace(" ", "_") === platformPath);

  useEffect(() => {
    if (files.length === 0) return;
    setLoading(true);
    importData(platform, files, log, dispatch).finally(() => {
      setLoading(false);
      navigate("/datasquare");
    });
  }, [platform, navigate, files, setLoading, log, dispatch]);

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ height: "calc(100vh - 38px)", width: "100vw" }}>
        <Grid.Column
          width={16}
          style={{
            minHeight: "70px",
            display: "flex",
            justifyContent: "space-between",
            alignContent: "flex-start",
            flexWrap: "wrap",
          }}
        >
          <BackButton />
          <GatherButtons />
        </Grid.Column>

        <Grid.Column width={10} style={{ height: "calc(100% - 50px)" }}>
          <Segment style={segmentStyle}>
            <Instructions platform={platform} language={language} />
          </Segment>
        </Grid.Column>
        <Grid.Column width={6} verticalAlign="middle" style={{ height: "calc(100% - 50px)" }}>
          <Segment style={segmentStyle}>
            <Dimmer active={loading}>
              <Loader />
            </Dimmer>
            <ImportData t={t} platform={platform} setFiles={setFiles} />
          </Segment>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
};

const Instructions = ({ platform, language }) => {
  if (!platform) return null;
  let instruction = platform.instructions?.[language] || platform.instructions.default;

  return <StepwiseInstructions instruction={instruction} icon={platform?.icon} />;
};

const importData = async (platform, files, log, dispatch) => {
  const meps = miseEnPlace(platform?.cookbook, files);
  log("start gathering");

  for (let mep of meps) {
    const recipe = mep.recipe.name;
    if (!platform?.importMap[recipe]) continue;

    const result = await mep.cook(); // returns array of objects with data, or null if can't find
    if (result.status !== "success") continue;

    await db.addData(
      result.data,
      platform?.importMap[recipe].data,
      "Google Takeout",
      recipe,
      platform?.importMap[recipe].idFields
    );
  }
};

export default GatherScreen;
