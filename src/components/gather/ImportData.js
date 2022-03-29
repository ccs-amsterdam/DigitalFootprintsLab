import React from "react";
import { Header, List, Icon, Popup } from "semantic-ui-react";

import { DropZone } from "data-donation-importers";

const ImportData = ({ t, platform, instruction, setFiles }) => {
  return (
    <>
      <Header as="h1" textAlign="center" style={{ color: "rgb(65, 131, 196)" }}>
        {t("gather.importdata.header")}
      </Header>
      <br />
      <DropZone
        allowedFiles={platform?.cookbook?.files}
        setAcceptedFiles={setFiles}
        label={
          <span>
            <Header style={{ color: "white" }}>{t("gather.importdata.dropzone.header")}</Header>
            <p>{t("gather.importdata.dropzone.p1")}</p>
            <p>{t("gather.importdata.dropzone.p2")}</p>
            <p>{t("gather.importdata.dropzone.p3")}</p>
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

      {/* <div style={{ textAlign: "center" }}>
        <Icon name="long arrow alternate up" size="huge" style={{ margin: "20px 0px" }} />
        <Icon name="file alternate" size="huge" />
        <Icon name="mouse pointer" />
      </div> */}
    </>
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

export default ImportData;
