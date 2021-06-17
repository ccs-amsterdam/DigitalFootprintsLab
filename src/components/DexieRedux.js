import React from "react";
import { useLiveQuery } from "dexie-react-hooks";
import { useDispatch } from "react-redux";
import db from "../apis/dexie";
import { setBrowserHistoryData, setPlatformStatus } from "../actions";

const DexieRedux = () => {
  // this is technically redundant, but I figured it would be nice to have all the logic
  // of monitoring the IndexedDb in one place. Basically, this component watches when
  // Dexie, and sends stuff to the Redux store
  const dispatch = useDispatch();

  useLiveQuery(async () => {
    const platformStatus = await db.idb.platforms.toArray();
    dispatch(setPlatformStatus(platformStatus));
  });

  useLiveQuery(async () => {
    let domainTotal = {};
    //let hourTotal = {};
    //let hourTopDomain = {};
    await db.idb.browsing_history.orderBy("domain").eachKey((domain) => {
      if (domain !== "") {
        domainTotal[domain] = (domainTotal[domain] || 0) + 1;
      }
    });

    const newdata = {};
    newdata["domainTotal"] = Object.keys(domainTotal).map((domain) => {
      return { text: domain, value: domainTotal[domain] };
    });

    dispatch(setBrowserHistoryData(newdata));
  });

  return <div></div>;
};

export default DexieRedux;
