import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import CardTemplate from "./CardTemplate";
import { List } from "semantic-ui-react";

const propTypes = {
  /** The name of the type of data to explore. */
  name: PropTypes.string.isRequired,
  /** A subname, for extra info */
  subname: PropTypes.string.isRequired,
  /** The name of an Icon from semantic ui, see https://semantic-ui.com/elements/icon.html  */
  icon: PropTypes.string.isRequired,
};

/**
 * The template for generating ExploreCards.
 * These are the cards in the Explore column on the home page.
 */
const ExploreCard = ({ name, subname, icon }) => {
  const navigate = useNavigate();
  const statuses = useSelector((state) => {
    return state.dataStatus.filter((data) => data.name === name && data.date);
  });

  if (!statuses || statuses.length === 0) return null;

  const onClick = () => {
    console.log(name);
    navigate("/" + name);
  };

  return (
    <CardTemplate name={name} subname={subname} icon={icon} onClick={onClick}>
      <List>{statuses.map(statusMessage)}</List>
    </CardTemplate>
  );
};

const statusMessage = (status) => {
  const date = status.date;
  if (!date) return "Data not yet gathered"; // this shouldn't happen (card should only be shown if data available)

  const oldTime = date.toISOString();
  const currentTime = new Date().toISOString();

  // if different day, show day
  const today = oldTime.slice(0, 10) === currentTime.slice(0, 10);
  const onDate = today ? "today" : `on ${oldTime.slice(0, 10)}`;

  return (
    <List.Item key={status.source}>
      <List.Content>
        Gathered {onDate} from <b>{status.source.replace("_", " ")}</b>
      </List.Content>
    </List.Item>
  );
};

ExploreCard.propTypes = propTypes;
export default ExploreCard;
