import React, { useState, useEffect } from "react";
import ColoredBackgroundGrid from "components/explore/dashboards/dashboardParts/ColoredBackgroundGrid";
import { Dimmer, Grid, Loader, Segment } from "semantic-ui-react";
import background from "images/background.jpeg";
import useLogger from "util/useLogger";
import { useLocation, useNavigate } from "react-router-dom";
import { gatherSettings } from "project/gatherSettings";
import DownloadData from "./DownloadData";
import { useTranslation } from "react-i18next";
import ImportData from "./ImportData";
import { useDispatch } from "react-redux";
import { miseEnPlace } from "data-donation-importers";
import db from "apis/db";
import MenuGridRow from "components/routing/MenuGridRow";

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

  let instruction = platform?.instructions?.[language] || platform?.instructions?.default;

  return (
    <ColoredBackgroundGrid background={background} color={"#000000b0"}>
      <Grid stackable style={{ marginLeft: "5px", marginRight: "5px" }}>
        <MenuGridRow gatherScreen />

        <Grid.Column width={10} style={{ minHeight: "calc(100vh - 40px)" }}>
          <Segment style={segmentStyle}>
            <DownloadData t={t} instruction={instruction} icon={platform?.icon} />
          </Segment>
        </Grid.Column>
        <Grid.Column width={6} style={{ height: "calc(100% - 40px)" }}>
          <Segment style={segmentStyle}>
            <ImportData t={t} platform={platform} instruction={instruction} setFiles={setFiles} />
            <Dimmer active={loading}>
              <Loader />
            </Dimmer>
          </Segment>
        </Grid.Column>
      </Grid>
    </ColoredBackgroundGrid>
  );
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
