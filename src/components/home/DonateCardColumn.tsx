import React from "react";
import CardTemplate from "./CardTemplate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";
import { gatherSettings } from "project/gatherSettings";

const requestedData = [];
for (const gs of gatherSettings) {
  for (const name of Object.keys(gs.importMap)) {
    requestedData.push(name);
  }
}

/**
 * Returns all donate cards to be rendered on the home page.
 */
const DonateCardColumn = () => {
  const statuses = useSelector((state: any) => state.dataStatus);
  if (statuses.length === 0) return null;

  return (
    <>
      <FilterCard />
      <DonateCard requestedData={requestedData} statuses={statuses} />
    </>
  );
};

const FilterCard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/remove");
  };

  return (
    <CardTemplate
      name={t("home.donate.removeCard.name")}
      subname={t("home.donate.removeCard.subname")}
      icon={"eye slash"}
      onClick={onClick}
    ></CardTemplate>
  );
};

const DonateCard = ({ requestedData, statuses }) => {
  const { t } = useTranslation();

  let any = false;
  let all = true;
  const gathered = requestedData.map((source) => {
    const status = statuses.find((s) => s.source === source);

    if (status && status.count > 0) {
      any = true;
    } else {
      all = false;
    }
    return status ? status : { source, missing: true };
  });

  const navigate = useNavigate();

  const onClick = () => {
    navigate("/donate");
  };

  const donateStatusSubname = (any, all) => {
    if (all) return null;
    if (any) return <p>{t("home.donate.donateCard.status.any")}</p>;
    return (
      <p>
        <Trans i18Key="home.donate.donateCard.status.none" components={{ b: <b /> }} />
      </p>
    );
  };

  return (
    <CardTemplate
      name={t("home.donate.donateCard.name")}
      subname={t("home.donate.donateCard.subname")}
      icon={"flag checkered"}
      onClick={onClick}
      disabled={!any}
    >
      <List style={{ textAlign: "left", paddingTop: "10px" }}>
        {gathered.map((g, i) => statusMessage(g, i))}
      </List>
      <span style={{ fontSize: "0.9em", color: "#ff7b00" }}>{donateStatusSubname(any, all)}</span>
    </CardTemplate>
  );
};

const statusMessage = (gathered, i) => {
  const name = gathered.source.replace("_", " ");

  if (!gathered.missing)
    return (
      <List.Item key={i}>
        <List.Icon name="clipboard outline" />
        <List.Content>
          <Trans
            i18nKey="home.donate.donateCard.status.ready"
            values={{ name: name }}
            components={{ b: <b /> }}
          />
        </List.Content>
      </List.Item>
    );

  return (
    <List.Item key={i}>
      <List.Icon name="exclamation" color="red" />
      <List.Content>
        <Trans
          i18nKey="home.donate.donateCard.status.notReady"
          values={{ name: name }}
          components={{ b: <b /> }}
        />
      </List.Content>
    </List.Item>
  );
};

export default DonateCardColumn;
