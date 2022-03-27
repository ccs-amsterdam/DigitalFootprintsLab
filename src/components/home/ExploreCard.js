import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardTemplate from "./CardTemplate";
import { List } from "semantic-ui-react";

/**
 * The template for generating ExploreCards.
 * These are the cards in the Explore column on the home page.
 */
const ExploreCard = ({ name, label, subname, icon }) => {
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
      <List>{statuses.map((status) => statusMessage(status))}</List>
    </CardTemplate>
  );
};

const statusMessage = (status) => {
  const source = `${status.source} - ${status.file}`.replaceAll("_", " ");

  return (
    <List.Item key={source}>
      <List.Content>
        <b>{source}</b> <i>({status.count})</i>
      </List.Content>
    </List.Item>
  );
};

export default ExploreCard;
