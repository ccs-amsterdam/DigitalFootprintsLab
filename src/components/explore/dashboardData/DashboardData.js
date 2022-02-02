import db from "apis/db";

// move as much of the common data wrangling stuff here

export default class DashboardData {
  constructor(name, data, setData, deleted = null) {
    this.name = name;
    this.data = data;
    this.setData = setData;
    this.deleted = deleted ? deleted : new Array(data.length).fill(false);
  }

  triggerUpdate() {
    // need to deep copy class to trigger state update, and just recreating it seems fastest
    this.setData(new DashboardData(this.name, this.data, this.setData, this.deleted));
  }

  async rmID(indices) {
    // remove data by index. Note that data has a ._INDEX field to be certain the right indices are used
    const deleted = [...this.deleted];
    console.log(indices);
    for (let i of indices) deleted[i] = true;
    try {
      await db.setDeleted(this.name, deleted);
      this.deleted = deleted; // only update locally if DB write succeeded
      this.triggerUpdate();
    } catch (e) {
      console.log("could not delete data");
    }
  }

  search(query, fields = null) {
    // query can be a single query (string) or array.
    // fields can be specific fields to search in, otherwise use all.
    if (query === null || query.length === 0) return null;

    const selection = [];

    const queries = Array.isArray(query) ? query : [query];
    const regexes = [];
    for (let q of queries) regexes.push(new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/, "\\$&"), "i"));

    for (let i = 0; i < this.data.length; i++) {
      if (this.deleted[i]) continue;
      const searchIn = fields ? fields : Object.keys(this.data[i]);
      field_loop: for (let field of searchIn) {
        for (let regex of regexes) {
          if (regex.test(this.data[i][field])) {
            selection.push(i);
            break field_loop;
          }
        }
      }
    }
    return selection;
  }

  searchValues(values, field) {
    if (values === null || values.length === 0) return null;

    const valueMap = values.reduce((obj, value) => {
      obj[value] = true;
      return obj;
    }, {});

    const selection = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.data[i]._DELETED) continue;
      if (Array.isArray(this.data[i][field])) {
        for (let datavalue of this.data[i][field]) {
          if (valueMap[datavalue]) {
            selection.push(i);
            break;
          }
        }
      } else {
        if (valueMap[this.data[i][field]]) selection.push(i);
      }
    }
    return selection;
  }

  findIndices(filterFunction) {
    // argument is a function. Takes data item as argument and should return bool
    const selection = [];
    for (let i = 0; i < this.data.length; i++) {
      if (this.deleted[i]) continue;
      if (filterFunction(this.data[i])) selection.push(i);
    }
    return selection;
  }

  count(field, selection, joinArray = null) {
    // count unique values in field, return as {[value]: n, [value]: n}
    // if field is an array, individual items will be counted, unless
    // joinArray is not null, in which case the items are joined (.join) with the given separator
    let counts = {};

    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;

      if (this.deleted[index]) continue;
      let values = this.data[index][field];
      if (!Array.isArray(values)) values = [values];
      if (joinArray) values = [values.join(joinArray)];
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

      if (this.deleted[index]) continue;
      n++;
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

      if (this.deleted[index]) continue;
      list.push(this.data[index]);
    }
    return list;
  }
}
