import db from "apis/db";
import { useState, useEffect } from "react";

/**
 * Get domain info for given dashData instance.
 * assumes dashData.data.columns exists
 * @param {*} dashData
 * @returns
 */
export default function useDomainInfo(dashData) {
  const [data, setData] = useState([]);
  const [domains, setDomains] = useState(null);

  useEffect(() => {
    if (!dashData?.data) return;
    const domains = {};
    for (let d of dashData.data) if (d?.domain && !domains[d.domain]) domains[d.domain] = true;
    setDomains(Object.keys(domains));
  }, [dashData?.data]);

  useEffect(() => {
    if (!domains || domains.length === 0) return;
    const fetchData = async () => {
      const data = await updateDomainInfo(domains);
      setData(data);
    };

    fetchData();
  }, [domains]);

  return data;
}

export const updateDomainInfo = async (domains) => {
  //let cache = await db.getDomainInfo(domains);
  let cache = {};

  // Check which domains are in the cache
  const domainsToFetch = domains.filter((domain) => !cache[domain] || !cache[domain].retry);

  if (domainsToFetch.length === 0) {
    return cache;
  }

  // Create empty entries in cache to prevent refetching if domain is not available in service
  for (let domain of domainsToFetch) cache[domain] = {};

  const data = await fetchData(domainsToFetch);

  // Store results and return results including cached
  db.addDomainInfo(data);

  for (const [key, value] of Object.entries(data)) {
    cache[key] = value;
  }
  console.log(cache);

  return cache;
};

const fetchData = async (domainsToFetch) => {
  // try fetching data from amcat. If failed, return empty data with .retry = true to trigger
  // retry on next call
  try {
    const token = await generateToken("1234", domainsToFetch);
    const body = {
      token,
      urls: domainsToFetch,
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
    const empty = domainsToFetch.reduce((obj, domain) => {
      obj[domain] = { retry: true };
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
