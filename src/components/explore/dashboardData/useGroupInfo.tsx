import db from "apis/db";
import { useState, useEffect } from "react";

/**
 * Get group (e.g., domain, channel) info for given dashData instance.
 * assumes dashData.data exists
 * @param {*} dashData
 * @param {*} group   the name of the column in dashData.data that will be grouped
 * @param {*} type    The type of the group. Currently supports 'domain'
 */
export default function useGroupInfo(dashData, group, type = "domain") {
  const [data, setData] = useState([]);
  const [groups, setGroups] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!dashData?.data) return;
    const groups = {};
    for (const d of dashData.data) if (d?.[group] && !groups[d[group]]) groups[d[group]] = true;
    setGroups(Object.keys(groups));
  }, [dashData?.data, group]);

  useEffect(() => {
    if (!groups) return;
    setReady(false);
    const fetchData = async () => {
      try {
        const data = await updateGroupInfo(groups, type);
        setData(data);
      } catch (e) {
        console.log(e);
      }
      setReady(true);
    };

    fetchData();
  }, [groups, type]);

  return [data, ready];
}

export const updateGroupInfo = async (groups, type = null) => {
  const cache = await db.getGroupInfo(groups);
  //let cache = {};    // use this for dev when dutch domains has updated

  // Check which groups are in the cache
  const groupsToFetch = groups.filter((group) => !cache[group] || !cache[group].retry);

  if (groupsToFetch.length === 0) {
    return cache;
  }

  // Create empty entries in cache to prevent refetching if group is not available in service
  for (const group of groupsToFetch) cache[group] = {};

  let data = {};
  if (type === "domain") data = await fetchDomainData(groupsToFetch, 5000); //

  // Store results and add to cache
  db.addGroupInfo(data);
  for (const [group, info] of Object.entries(data)) cache[group] = info;

  return cache;
};

const fetchDomainData = async (groupsToFetch, timeout) => {
  // try fetching data from amcat. If failed, return empty data with .retry = true to trigger
  // retry on next call
  try {
    const token = await generateToken("1234", groupsToFetch);
    const body = {
      token,
      urls: groupsToFetch,
    };

    // Make request
    const response = await fetchWithTimeout("https://dd.amcat.nl", {
      timeout, // if backend slow, use fallback
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

async function fetchWithTimeout(resource, options: any = { timeout: 8000 }) {
  // https://dmitripavlutin.com/timeout-fetch-request/
  const { timeout = 8000 } = options;

  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const response = await fetch(resource, {
    ...options,
    signal: controller.signal,
  });
  clearTimeout(id);
  return response;
}

const generateToken = async (key, urls) => {
  const message = [key].concat(urls).join("|");
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};
