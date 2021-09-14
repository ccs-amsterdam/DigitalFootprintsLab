import React from "react";
import PropTypes from "prop-types";
import { Icon } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";

const propTypes = {
  /** The name of the platform from which to gather the data */
  name: PropTypes.string.isRequired,
  /** A subname, for extra info */
  subname: PropTypes.string.isRequired,
  /** The name of an Icon from semantic ui, see https://semantic-ui.com/elements/icon.html  */
  icon: PropTypes.string.isRequired,
  /** Event handler for clicks. Not strictly necessary, because the card can also be used as a trigger (as in GatherGoogleTakeout) */
  onClick: PropTypes.func,
  /** String indicating loading status */
  loading: PropTypes.string.isRequired,
};

/**
 * The template for generating GatherCards.
 * These are the cards in the Gather column on the home page.
 */
const GatherCard = ({ name, subname, icon, onClick, loading }) => {
  const statusMessage = (loading) => {
    if (loading === "failed")
      return (
        <>
          <Icon name="close" color="red" />
          <i>Something went wrong :(</i>
        </>
      );
    if (loading === "finished")
      return (
        <>
          <Icon name="checkmark" color="green" />
          <i>Data succesfully imported</i>
        </>
      );
    return <i>Click here to gather data</i>;
  };

  return (
    <CardTemplate name={name} subname={subname} icon={icon} onClick={onClick} loading={loading}>
      {statusMessage(loading)}
    </CardTemplate>
  );
};

GatherCard.propTypes = propTypes;
export default GatherCard;
