import db from "apis/db";
import { useState, useEffect } from "react";

/**
 * Get group (e.g., domain, channel) info for given dashData instance.
 * assumes dashData.data.columns exists
 * @param {*} dashData
 * @returns
 */
export default function useGroupInfo(dashData, group) {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState(null);

  useEffect(() => {
    if (!dashData?.data) return;
    const groups = {};
    for (let d of dashData.data) if (d?.[group] && !groups[d[group]]) groups[d[group]] = true;
    setGroups(Object.keys(groups));
  }, [dashData?.data, group]);

  useEffect(() => {
    if (!groups || groups.length === 0) return;
    const fetchData = async () => {
      const data = await updateGroupInfo(groups);
      setData(data);
    };

    fetchData();
  }, [groups]);

  return data;
}

export const updateGroupInfo = async (groups) => {
  let cache = await db.getGroupInfo(groups);
  //let cache = {};    // use this for dev when dutch domains has updated

  // Check which groups are in the cache
  const groupsToFetch = groups.filter((group) => !cache[group] || !cache[group].retry);

  if (groupsToFetch.length === 0) {
    return cache;
  }

  // Create empty entries in cache to prevent refetching if group is not available in service
  for (let group of groupsToFetch) cache[group] = {};

  const data = await fetchData(groupsToFetch);

  // Store results and return results including cached
  db.addGroupInfo(data);

  for (const [key, value] of Object.entries(data)) {
    cache[key] = value;
  }
  console.log(cache);

  return cache;
};

const fetchData = async (groupsToFetch) => {
  // try fetching data from amcat. If failed, return empty data with .retry = true to trigger
  // retry on next call
  try {
    const token = await generateToken("1234", groupsToFetch);
    const body = {
      token,
      urls: groupsToFetch,
    };

    // Make request
    const response = await fetch("https://dd.amcat.nl", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return data;
  } catch (e) {
    const empty = groupsToFetch.reduce((obj, group) => {
      obj[group] = { retry: true };
      return obj;
    }, {});
    return empty;
  }
};

const generateToken = async (key, urls) => {
  var message = [key].concat(urls).join("|");
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
