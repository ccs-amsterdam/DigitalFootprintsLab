import { useState, useEffect } from "react";
import db from "apis/dexie";
import { useLiveQuery } from "dexie-react-hooks";
import { useDomainInfo } from "./useDomainInfo";

const useRawEntries = (table) => {
  const [entries, setEntries] = useState([]);
  const n = useLiveQuery(() => db.idb.table(table).count());

  useEffect(() => {
    const fetchData = async () => {
      console.log("fetching from db", n);
      const t = await db.idb.table(table);
      const collection = await t.toCollection();
      const rawEntries = await collection.toArray();
      setEntries(rawEntries);
    };
    fetchData();
  }, [table, n]);

  return [entries];
};

export const useDatabaseEntries = (table, field) => {
  //TODO: I guess this only applies for field === 'domain'
  const [loadingData, setLoadingData] = useState(false);
  const [keyTotalObj, setKeyTotalObj] = useState({});
  const [entries] = useRawEntries(table);
  const [allDomains, setAllDomains] = useState([]);
  const [, domainInfo] = useDomainInfo(allDomains);

  // List of domains from raw entries
  useEffect(() => {
    const domains = [
      ...new Set(
        entries.map((e) => e["domain"]).filter((e) => e !== "localhost" && e !== "newtab")
      ),
    ];
    setAllDomains(domains);
  }, [entries]);

  // Process raw entries and domain info into object tree for Vega
  useEffect(() => {
    setLoadingData(true);

    const keyTotalObj = {};

    for (let entry of entries) {
      let keys = Array.isArray(entry[field]) ? entry[field] : [entry[field]];
      for (let key of keys) {
        if (key !== "") {
          key = key.split(".").slice(-2).join("."); // poor man's domain extraction

          // Domain entry
          if (keyTotalObj[key] === undefined) {
            const category = domainInfo[key]?.category ? domainInfo[key].category : "Unknown";
            const logo = domainInfo[key]?.logo
              ? `https://ifb.sharkwing.com/logo/${domainInfo[key].logo.split("/").slice(-1)}`
              : `https://ifb.sharkwing.com/favicon/${key}.ico`;
            keyTotalObj[key] = {
              id: entry.id,
              type: "domain",
              name: key,
              parent: category,
              count: 1,
              ids: [entry.id],
              category,
              logo,
            };
          } else {
            keyTotalObj[key].count++;
            keyTotalObj[key].ids.push(entry.id);
          }

          // Url entry
          const url = entry["url"];
          if (url !== key) {
            if (keyTotalObj[url] === undefined) {
              keyTotalObj[url] = {
                id: entry.id,
                type: "url",
                name: url,
                title: entry.title,
                parent: key,
                count: 1,
                ids: [entry.id],
              };
            } else {
              keyTotalObj[url].count++;
              keyTotalObj[url].ids.push(entry.id);
            }
          }
        }
      }
    }

    setKeyTotalObj(keyTotalObj);
    setLoadingData(false);
  }, [domainInfo, entries, field]);

  return [loadingData, keyTotalObj];
};
