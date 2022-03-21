import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardTemplate from "./CardTemplate";
import { List } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";

/**
 * The template for generating ExploreCards.
 * These are the cards in the Explore column on the home page.
 */
const ExploreCard = ({ name, label, subname, icon }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const statuses = useSelector((state) => {
    return state.dataStatus.filter((data) => data.name === name && data.date);
  });

  if (!statuses || statuses.length === 0) return null;

  const onClick = () => {
    navigate("/" + name);
  };

  return (
    <CardTemplate name={label} subname={subname} icon={icon} onClick={onClick}>
      <List>{statuses.map((status) => statusMessage(status, t))}</List>
    </CardTemplate>
  );
};

const statusMessage = (status, t) => {
  const date = status.date;
  if (!date) return t("home.explore.exploreCard.missing"); // this shouldn't happen (card should only be shown if data available)

  const oldTime = date.toISOString();
  const currentTime = new Date().toISOString();

  // if different day, show day
  const today = oldTime.slice(0, 10) === currentTime.slice(0, 10);

  return (
    <List.Item key={status.source}>
      <List.Content>
        <Trans
          i18nKey={"home.explore.exploreCard.status"}
          values={{
            date: today ? "today" : oldTime.slice(0, 10),
            source: status.source.replace("_", " "),
          }}
          components={{ b: <b /> }}
        />
      </List.Content>
    </List.Item>
  );
};

export default ExploreCard;
