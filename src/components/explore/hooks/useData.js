import { useEffect, useState } from "react";
import db from "apis/db";

/**
 * Get a dataset as a DashboardData class, with methods for searching, counting and filtering the data.
 *
 * @param {*} name     Name in db.data
 * @param {*} fields   An array with fieldnames from data to use
 * @returns
 */
export default function useData(name, fields) {
  const [data, setData] = useState(null);

  useEffect(() => {
    createDashData(name, fields, setData);
  }, [name, fields]);

  return data;
}

const createDashData = async (name, fields, setData) => {
  try {
    let data = await db.getData(name, fields);
    console.log(data[0]);
    data = data.map((d, i) => ({ ...d, _ID: i, _DELETED: false }));
    const dashData = new DashboardData(name, data, setData); // with setData, dashboard can trigger its own state update
    setData(dashData);
  } catch (e) {
    console.log(e);
    setData(null);
  }
};

class DashboardData {
  constructor(name, data, setData) {
    this.name = name;
    this.data = data;
    this.setData = setData;
  }

  triggerUpdate() {
    this.setData(new DashboardData(this.name, this.data, this.setData));
  }

  async rmID(ids) {
    // remove data, using the values in the ._ID column
    const deleted = this.data.map((d) => d._DELETED);
    for (let i of ids) deleted[i] = true;
    try {
      await db.setDeleted(this.name, deleted);
      for (let i of ids) this.data[i]._DELETED = true; // only update if certain DB write succeeded
      this.triggerUpdate();
    } catch (e) {
      console.log("could not delete data");
    }
  }

  search(query, fields) {
    if (query === null || query === "") return null;

    const selection = [];
    const regex = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/, "\\$&"), "i");
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]._DELETED) continue;
      for (let field of fields) {
        if (regex.test(this.data[i][field])) {
          selection.push(i);
          break;
        }
      }
    }
    return selection;
  }

  filter(filterFunction) {
    // A filter function, similar to regular js filter function. Takes data item as argument and should return bool
    const selection = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]._DELETED) continue;
      if (filterFunction(this.data[i])) selection.push(i);
    }
    return selection;
  }

  count(field, selection) {
    // count unique values in field, return as {[value]: n, [value]: n}
    let counts = {};

    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;

      if (this.data[index]._DELETED) continue;
      let values = this.data[index][field];
      if (!Array.isArray(values)) values = [values];
      for (let value of values) {
        if (value === "") continue;
        if (!counts[value]) counts[value] = 0;
        counts[value]++;
      }
    }
    return counts;
  }

  N(selection) {
    let n = 0;
    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;

      if (this.data[index]._DELETED) continue;
      n += 1;
    }
    return n;
  }

  listData(n, selection) {
    let list = [];
    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (list.length === n) break;
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;

      if (this.data[index]._DELETED) continue;
      list.push(this.data[index]);
    }
    return list;
  }
}
