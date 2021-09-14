import { useLiveQuery } from "dexie-react-hooks";
import React from "react";
import { useDispatch } from "react-redux";
import { setDataStatus } from "actions";
import db from "apis/dexie";
import ExploreCard from "./ExploreCard";

/**
 * Returns all explore cards to be rendered on the home page.
 */
const ExploreCardColumn = () => {
  const dispatch = useDispatch();

  // useLiveQuery monitors IndexedDb and sends updates to the redux store
  // this is used to display the status of the cards
  useLiveQuery(async () => {
    const dataStatus = await db.idb.datastatus.toArray();
    dispatch(setDataStatus(dataStatus));
  });

  return (
    <>
      <Browsing />
      <Search />
      <Youtube />
    </>
  );
};

const Browsing = () => {
  return (
    <ExploreCard
      name={"Browsing history"}
      subname={"What pages did you visit?"}
      icon={"history"}
      table={"browsinghistory"}
    />
  );
};

const Search = () => {
  return (
    <ExploreCard
      name={"Google searches"}
      subname={"What did you search for?"}
      icon={"search"}
      table={"searchhistory"}
    />
  );
};

const Youtube = () => {
  return (
    <ExploreCard
      name={"Youtube"}
      subname={"Channels and videos"}
      icon={"youtube"}
      table={"youtube"}
    />
  );
};

export default ExploreCardColumn;
