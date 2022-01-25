import { useState, useEffect } from "react";
import db from "apis/dexie";
import { useLiveQuery } from "dexie-react-hooks";

/**
 *
 * hook for getting a DashboardData class object.
 * All stuff to do with data used in the dashboard should be handled efficiently within this class
 * so that the dashboard components stay nice and clean.
 *
 * @param {*} table          name of indexeddb table
 * @param {*} searchFields   array of column names to use in text search
 * @param {*} fields         either a single field name, or an array of fields to use for whatever (keywords, date)
 * @returns
 */
export default function useDashboardData(table, searchFields, fields) {
  // used to update when rows are deleted
  const ids = useLiveQuery(() => db.idb.table(table).toCollection().primaryKeys());
  const [data, setData] = useState(null);

  useEffect(() => {
    db.createDashboardData(table, searchFields, fields)
      .then((si) => {
        const dd = new DashboardData(si.arrayNames, si.index);
        setData(dd);
      })
      .catch((e) => {
        console.log(e);
        setData([]);
      });
  }, [table, searchFields, fields]);

  useEffect(() => {
    setData((data) => {
      if (!data) return data;
      console.log("filtering");
      return data.filterIds(ids);
    });
  }, [ids]);

  if (data) console.log(data.n());
  return data;
}

class DashboardData {
  constructor(arrayNames, index) {
    this.arrayNames = arrayNames;
    this.index = index;
  }

  n() {
    return Object.keys(this.index).length;
  }

  filterIds(ids) {
    // if items are deleted in the dashboard, update the dashboard data.
    // note that this returns the new dashboard (if we update it, we would still need
    // to deepclone it to trigger state update)
    if (ids.length === this.n()) return;
    const newIndex = {};
    for (let i = 0; i < ids.length; i++) {
      if (this.index[ids[i]]) newIndex[ids[i]] = this.index[ids[i]];
    }
    return new DashboardData(this.arrayNames, newIndex);
  }

  search(query) {
    if (query === null || query === "") return null;
    const regex = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/, "\\$&"), "i");
    const selection = [];

    for (let id of Object.keys(this.index)) {
      if (regex.test(this.index[id][0])) {
        selection.push(Number(id));
      }
    }
    return selection;
  }

  count(field) {
    // count unique values in field, return as {[value]: n, [value]: n}
    let counts = {};

    const arrayI = this.arrayNames.indexOf(field);
    if (arrayI < 0) return [];

    for (let id of Object.keys(this.index)) {
      let values = this.index[id][arrayI];
      if (!Array.isArray(values)) values = [values];
      for (let value of values) {
        if (value === "") continue;
        if (!counts[value]) counts[value] = 0;
        counts[value]++;
      }
    }

    return counts;
  }
}
