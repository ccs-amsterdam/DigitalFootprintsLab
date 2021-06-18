import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router";
import { setPlatformStatus } from "../actions";
import db from "../apis/dexie";
import CardTemplate from "./CardTemplate";

// the idea is to add all possible platforms here.
// each platform is a (very simple) component
// Platforms returns all of them

const PlatformCards = () => {
  const dispatch = useDispatch();

  // useLiveQuery monitors IndexedDb and sends updates to the redux store
  // this is used to display the status of the cards
  useLiveQuery(async () => {
    const platformStatus = await db.idb.platforms.toArray();
    dispatch(setPlatformStatus(platformStatus));
  });

  return <Chrome />;
};

const Chrome = () => {
  return (
    <PlatformCard
      name={"Chrome"}
      subname={"Browsing history"}
      icon={"chrome"}
      type={"browsinghistory"}
    />
  );
};

const PlatformCard = ({ name, subname, icon, type }) => {
  const history = useHistory();
  const platformStatus = useSelector((state) =>
    state.platformStatus.find((platform) => platform.name === name)
  );
  if (!platformStatus) return null;
  if (platformStatus.status === "failed" && !platformStatus.date) return null;

  const onClick = () => {
    history.push(`${type}?platform=${name}`);
  };

  return (
    <CardTemplate
      name={name}
      subname={subname}
      icon={icon}
      onClick={onClick}
      loading={platformStatus.status}
    >
      <i>{lastUpdated(platformStatus.date)}</i>
    </CardTemplate>
  );
};

const lastUpdated = (date) => {
  if (!date) return "Data not yet gathered";
  const oldTime = date.toISOString();
  const currentTime = new Date().toISOString();

  // if different day, show day
  if (oldTime.slice(0, 10) !== currentTime.slice(0, 10))
    return `Data gathered on ${oldTime.slice(0, 10)}`;

  // otherwise show time
  return "Data gathered today";
};

export default PlatformCards;
