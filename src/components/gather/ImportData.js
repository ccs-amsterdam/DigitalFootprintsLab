import React from "react";
import { Header, List, Icon, Popup } from "semantic-ui-react";

import { DropZone } from "data-donation-importers";

import { Trans } from "react-i18next";

const ImportData = ({ t, platform, setFiles }) => {
  return (
    <>
      <Header as="h1" textAlign="center" style={{ color: "rgb(65, 131, 196)" }}>
        {t("home.gather.finalStep.header")}
      </Header>

      <List style={{ textAlign: "center", fontSize: "1.3em" }}>
        <List.Item>
          <Trans i18nKey="home.gather.finalStep.step1" components={{ b: <b /> }} />
          <div>
            <GeneralDownloadHelp t={t} />
            <ChromeDownloadHelp t={t} />
            <FirefoxDownloadHelp t={t} />
            <SafariDownloadHelp t={t} />
          </div>
        </List.Item>
        <br />
        <List.Item>
          <Trans i18nKey="home.gather.finalStep.step2" components={{ b: <b /> }} />
          {platform?.fileHint ? (
            <p style={{ fontSize: "0.7em" }}>
              {t("gather.downloadfile.hint", "The file is (often) called")}{" "}
              <b>{platform.fileHint}</b>
            </p>
          ) : null}
        </List.Item>
        <br />
        <List.Item>
          <Trans i18nKey="home.gather.finalStep.step3" components={{ b: <b /> }} />
        </List.Item>
      </List>

      <DropZone allowedFiles={platform?.cookbook?.files} setAcceptedFiles={setFiles} />
      <div style={{ textAlign: "center" }}>
        <Icon name="long arrow alternate up" size="huge" style={{ margin: "20px 0px" }} />
        <Icon name="file alternate" size="huge" />
        <Icon name="mouse pointer" />
      </div>
    </>
  );
};

const GeneralDownloadHelp = ({ t }) => {
  return (
    <div style={{ fontSize: "0.7em" }}>
      <p>
        {t(
          "gather.downloadfolder.general.l1",
          "By default, most browsers save your downloaded files in the Download folder on your computer. If you have trouble finding the folder, you can also open it from your browser"
        )}{" "}
      </p>
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
      <Header>{t("gather.downloadfolder.chrome.header", "Finding Chrome Downloads")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t(
            "gather.downloadfolder.chrome.l1",
            "Click on the three dots in the upper right corner"
          )}{" "}
          <Icon name="ellipsis vertical" />
        </List.Item>
        <List.Item as="li">{t("gather.downloadfolder.chrome.l2", "Select 'Downloads'")} </List.Item>
        <List.Item as="li">
          {t("gather.downloadfolder.chrome.l2", "Click on 'show in folder'")}{" "}
        </List.Item>
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
      <Header>{t("gather.downloadfolder.firefox.header", "Finding Firefox Downloads")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t(
            "gather.downloadfolder.firefox.l1",
            "Click on the hamburger icon in the upper right corner"
          )}{" "}
          <Icon name="bars" />
        </List.Item>
        <List.Item as="li">
          {t("gather.downloadfolder.firefox.l2", "Select 'Downloads'")}{" "}
        </List.Item>
        <List.Item as="li">
          {t(
            "gather.downloadfolder.firefox.l2",
            "Click on the folder icon (on the right in the popup) to 'Show in folder'"
          )}{" "}
        </List.Item>
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
      <Header>{t("gather.downloadfolder.safari.header", "Finding Safari Downloads")}</Header>
      <List as="ol">
        <List.Item as="li">
          {t(
            "gather.downloadfolder.safari.l1",
            "Click on the downloads Icon in the upper right corner"
          )}{" "}
          <Icon name="arrow alternate circle down outline" />
        </List.Item>
        <List.Item as="li">
          {t(
            "gather.downloadfolder.safari.l2",
            "Click on the magnifying glass Icon next to a file to open the folder"
          )}{" "}
        </List.Item>
      </List>
    </Popup>
  );
};

export default ImportData;
