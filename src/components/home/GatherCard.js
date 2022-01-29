import React from "react";
import PropTypes from "prop-types";
import { List } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import { useSelector } from "react-redux";

const propTypes = {
  /** The name of the source from which to gather the data */
  source: PropTypes.string.isRequired,
  /** A subname, for extra info */
  subname: PropTypes.string.isRequired,
  /** An array of data names (e.g., Browsing history) that is expected to be produced */
  produces: PropTypes.array.isRequired,
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
const GatherCard = ({ source, subname, produces, icon, onClick, loading }) => {
  const statuses = useSelector((state) => {
    return state.dataStatus.filter((data) => data.source === source);
  });
  let done = true;
  const produced = produces.map((p) => {
    const status = statuses.find((s) => s.name === p);
    if (!status) done = false;
    return status ? status : { name: p, status: "empty" };
  });

  return (
    <CardTemplate
      name={source}
      subname={subname}
      icon={icon}
      onClick={onClick}
      loading={loading}
      done={done}
    >
      <List style={{ textAlign: "left" }}>{produced.map(statusMessage)}</List>
    </CardTemplate>
  );
};

const statusMessage = (produced) => {
  const name = produced.name.replace("_", " ");
  if (produced.status === "failed")
    return (
      <List.Item>
        <List.Icon name="close" color="red" />
        <List.Content>
          Failed to get <b>{name}</b>
        </List.Content>
      </List.Item>
    );
  if (produced.status === "finished")
    return (
      <List.Item>
        <List.Icon name="check circle outline" color="green" />
        <List.Content>
          Gathered <b>{name}</b>
        </List.Content>
      </List.Item>
    );

  return (
    <List.Item>
      <List.Icon name="circle outline" />
      <List.Content>
        Click to gather <b>{name}</b>
      </List.Content>
    </List.Item>
  );
};

GatherCard.propTypes = propTypes;
export default GatherCard;