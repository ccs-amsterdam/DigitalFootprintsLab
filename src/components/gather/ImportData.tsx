import { useEffect, useState } from "react";
import { Header, List, Icon, Popup, Segment, Dimmer, Loader } from "semantic-ui-react";
import db from "apis/db";
import { miseEnPlace } from "data-donation-importers";
import { DropZone } from "data-donation-importers";
import { useNavigate } from "react-router-dom";
import useLogger from "util/useLogger";

const ImportData = ({ t, platform, instruction }) => {
  const navigate = useNavigate();

  const log = useLogger("Gatherscreen", "open");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (files.length === 0) return;
    setLoading(true);
    importData(platform, files, log).finally(() => {
      setLoading(false);
      navigate("/datasquare");
    });
  }, [platform, navigate, files, setLoading, log]);

  return (
    <Segment
      style={{
        border: "none",
        boxShadow: "none",
        background: "white",
        height: "100%",
        color: "black",
        minHeight: "300px",
      }}
    >
      <br />
      <DropZone
        allowedFiles={platform?.cookbook?.files}
        setAcceptedFiles={setFiles}
        label={
          <span>
            <Header style={{ color: "white" }}>{t("gather.importdata.dropzone.header")}</Header>
            <p>{t("gather.importdata.dropzone.p1")}</p>
            <p>{t("gather.importdata.dropzone.p2")}</p>
          </span>
        }
      />

      <List style={{ textAlign: "center", fontSize: "1.3em" }}>
        <Icon name="question circle outline" />
        <List.Item>
          <b>{t("gather.importdata.where.header")}</b>
          <div>
            <GeneralDownloadHelp t={t} />
            <ChromeDownloadHelp t={t} />
            <FirefoxDownloadHelp t={t} />
            <SafariDownloadHelp t={t} />
          </div>
        </List.Item>
        <br />
        {instruction?.fileHint ? (
          <List.Item>
            <b>{t("gather.importdata.file.header")}</b>
            <p style={{ fontSize: "0.7em" }}>
              {t("gather.importdata.file.hint")} <b>{instruction.fileHint}</b>.
            </p>
          </List.Item>
        ) : null}
        <br />
      </List>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
    </Segment>
  );
};

const GeneralDownloadHelp = ({ t }) => {
  return (
    <div style={{ fontSize: "0.7em" }}>
      <p>{t("gather.importdata.where.general")} </p>
    </div>
  );
};

const ChromeDownloadHelp = ({ t }) => {
  return (
    <Popup
      on="click"
      wide="very"
      trigger={<Icon name="chrome" style={{ cursor: "pointer", color: "rgb(65, 131, 196)" }} />}
    >
      <Header>{t("gather.importdata.where.chrome.header")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t("gather.importdata.where.chrome.l1")} <Icon name="ellipsis vertical" />
        </List.Item>
        <List.Item as="li">{t("gather.importdata.where.chrome.l2")} </List.Item>
        <List.Item as="li">{t("gather.importdata.where.chrome.l3")} </List.Item>
      </List>
    </Popup>
  );
};

const FirefoxDownloadHelp = ({ t }) => {
  return (
    <Popup
      on="click"
      wide="very"
      trigger={<Icon name="firefox" style={{ cursor: "pointer", color: "red" }} />}
    >
      <Header>{t("gather.importdata.where.firefox.header")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t("home.gather.downloadfolder.firefox.l1")} <Icon name="bars" />
        </List.Item>
        <List.Item as="li">{t("gather.importdata.where.firefox.l2")} </List.Item>
        <List.Item as="li">{t("gather.importdata.where.firefox.l3")} </List.Item>
      </List>
    </Popup>
  );
};

const SafariDownloadHelp = ({ t }) => {
  return (
    <Popup
      on="click"
      wide="very"
      trigger={<Icon name="safari" style={{ cursor: "pointer", color: "blue" }} />}
    >
      <Header>{t("gather.importdata.where.safari.header")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t("gather.importdata.where.safari.l1")}{" "}
          <Icon name="arrow alternate circle down outline" />
        </List.Item>
        <List.Item as="li">{t("gather.importdata.where.safari.l2")} </List.Item>
      </List>
    </Popup>
  );
};

const importData = async (platform, files, log) => {
  const meps = miseEnPlace(platform?.cookbook, files);

  const gathered = [];
  for (const mep of meps) {
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
    gathered.push(recipe);
  }

  if (gathered.length > 0) {
    log("gathered: " + gathered.join(", "));
  } else {
    log("failed to gather data");
  }
};

export default ImportData;
