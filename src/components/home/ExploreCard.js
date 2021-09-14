import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import CardTemplate from "./CardTemplate";

const propTypes = {
  /** The name of the type of data to explore. */
  name: PropTypes.string.isRequired,
  /** A subname, for extra info */
  subname: PropTypes.string.isRequired,
  /** The name of an Icon from semantic ui, see https://semantic-ui.com/elements/icon.html  */
  icon: PropTypes.string.isRequired,
  /** The name of the table used for this data type in indexedDB */
  table: PropTypes.string.isRequired,
};

/**
 * The template for generating ExploreCards.
 * These are the cards in the Explore column on the home page.
 */
const ExploreCard = ({ name, subname, icon, table }) => {
  const history = useHistory();
  const dataStatus = useSelector((state) => {
    return state.dataStatus.find((data) => data.name === table);
  });
  if (!dataStatus) return null;
  if (dataStatus.status === "failed" && !dataStatus.date) return null;

  const onClick = () => {
    history.push(table);
  };

  return (
    <CardTemplate
      name={name}
      subname={subname}
      icon={icon}
      onClick={onClick}
      loading={dataStatus.status}
    >
      <i>{lastUpdated(dataStatus.date)}</i>
    </CardTemplate>
  );
};

const lastUpdated = (date) => {
  if (!date) return "Data not yet gathered";
  const oldTime = date.toISOString();
  const currentTime = new Date().toISOString();

  // if different day, show day
  if (oldTime.slice(0, 10) !== currentTime.slice(0, 10))
    return `Data imported on ${oldTime.slice(0, 10)}`;

  // otherwise show time
  return "Data imported today";
};

ExploreCard.propTypes = propTypes;
export default ExploreCard;
