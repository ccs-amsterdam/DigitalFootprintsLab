import React from "react";
import CardTemplate from "./CardTemplate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";

const requestedData = ["Browsing", "Search", "Youtube"];

/**
 * Returns all donate cards to be rendered on the home page.
 */
const DonateCardColumn = () => {
  const statuses = useSelector((state) => state.dataStatus);
  if (!statuses.find((s) => s.status === "finished")) return null;

  return (
    <>
      <FilterCard />
      <DonateCard requestedData={requestedData} />
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
      icon={"user secret"}
      onClick={onClick}
    ></CardTemplate>
  );
};

const DonateCard = ({ requestedData }) => {
  const { t } = useTranslation();
  const statuses = useSelector((state) => state.dataStatus);

  let any = false;
  let all = true;
  const gathered = requestedData.map((name) => {
    const status = statuses.find((s) => s.name === name);
    if (status?.status === "finished") {
      any = true;
    } else {
      all = false;
    }
    return status ? status : { name, status: "empty" };
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
      name={"Go to donation screen"}
      subname={
        "Here you can learn more about what your data will be used for, and safely donate it"
      }
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
  const name = gathered.name.replace("_", " ");

  if (gathered.status === "finished")
    return (
      <List.Item key={i}>
        <List.Icon name="check circle outline" color="green" />
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
      <List.Icon name="circle outline" />
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
