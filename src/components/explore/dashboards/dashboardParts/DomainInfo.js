import { useRef, useState, useEffect } from "react";

const generateToken = async (key, urls) => {
  var message = [key].concat(urls).join("|");
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
};

export const useDomainInfo = (domains) => {
  const cacheRef = useRef({});
  const [status, setStatus] = useState("idle");
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      setStatus("fetching");
      let cache = cacheRef.current;

      // Check which domains are in the cache
      const cachedDomains = Object.keys(cache);
      const domainsToFetch = domains.filter((domain) => !cachedDomains.includes(domain));
      if (domainsToFetch.length === 0) {
        setData(cache);
        setStatus("fetched from cache");
        return;
      }

      // Create empty entries in cache to prevent refetching if domain is not available in service
      for (let domain of domainsToFetch) {
        cache[domain] = {};
      }

      // Construct request
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

      // Merge result with cache
      const data = await response.json();
      for (const [key, value] of Object.entries(data)) {
        cache[key] = value;
      }
      setData(cache);
      setStatus("fetched");
    };

    fetchData();
  }, [domains]);

  return [status, data];
};
