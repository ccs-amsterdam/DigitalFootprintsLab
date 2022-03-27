import db from "apis/db";

// move as much of the common data wrangling stuff here

export default class DashboardData {
  constructor(name, data, setData, deleted = null, is_subset = false) {
    this.name = name;
    this.data = data;
    this.setData = setData;
    this.deleted = deleted ? deleted : new Array(data.length).fill(false);
    this.is_subset = is_subset;
  }

  triggerUpdate() {
    // need to deep copy class to trigger state update, and just recreating it seems fastest
    this.setData(
      new DashboardData(this.name, this.data, this.setData, this.deleted, this.is_subset)
    );
  }

  async rmID(indices) {
    // remove data by index. It isn't actcually immediately deleted. The deleted bool vector
    // is written to the DB, and will be applied on the next getData call. In the current
    // DashData object the
    const deleted = [...this.deleted];
    for (let i of indices) deleted[i] = true;
    try {
      await db.setDeleted(this.name, deleted);
      this.deleted = deleted; // only update locally if DB write succeeded
      this.triggerUpdate();
    } catch (e) {
      console.log("could not delete data");
    }
  }

  subset(indices) {
    // take a subset of the dashdata
    // this disables the posibility to use a selection, but lets us remove data rows to limit memory use.
    // Specifically designed for the RemoveData step where multiple datasets are queried back-to-back
    this.data = indices.map((i) => this.data[i]);
    this.is_subset = true;
  }

  search(query, fields = null) {
    // query can be a single query (string) or array.
    // fields can be specific fields to search in, otherwise use all.
    if (query === null || query.length === 0) return null;

    const selection = [];

    const queries = Array.isArray(query) ? query : [query];
    const regexes = [];
    for (let q of queries) regexes.push(new RegExp(q.replace(/[-/\\^$*+?.()|[\]{}]/, "\\$&"), "i"));

    for (let item of this.data) {
      const index = item._INDEX;
      if (this.deleted[index]) continue;
      const searchIn = fields ? fields : Object.keys(item);
      field_loop: for (let field of searchIn) {
        if (!item[field]) continue;
        for (let regex of regexes) {
          if (regex.test(item[field])) {
            selection.push(index);
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
    for (let item of this.data) {
      const index = item._INDEX;
      if (this.deleted[index]) continue;
      if (Array.isArray(item[field])) {
        for (let datavalue of item[field]) {
          if (valueMap[datavalue]) {
            selection.push(index);
            break;
          }
        }
      } else {
        if (valueMap[item[field]]) selection.push(index);
      }
    }
    return selection;
  }

  count(field, selection, joinArray = null) {
    // count unique values in field, return as {[value]: n, [value]: n}
    // if field is an array, individual items will be counted, unless
    // joinArray is not null, in which case the items are joined (.join) with the given separator
    if (selection && this.is_subset)
      throw new Error("cannot use selection if dashdata is a subset");
    let counts = {};

    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;
      if (this.deleted[this.data[index]._INDEX]) continue; // use _INDEX in case data is_subset

      let values = this.data[index][field];
      if (!Array.isArray(values)) values = [values];
      if (joinArray) values = [values.join(joinArray)];
      for (let value of values) {
        if (!value) continue;
        if (!counts[value]) counts[value] = 0;
        counts[value]++;
      }
    }
    return counts;
  }

  N(selection) {
    if (selection && this.is_subset)
      throw new Error("cannot use selection if dashdata is a subset");
    let n = 0;
    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;
      if (this.deleted[this.data[index]._INDEX]) continue; // use _INDEX in case data is_subset

      n++;
    }
    return n;
  }

  listData(n, selection, offset) {
    if (selection && this.is_subset)
      throw new Error("cannot use selection if dashdata is a subset");
    let list = [];

    let index;
    for (let i = 0; i < this.data.length; i++) {
      if (list.length === n) break;
      if (offset && i < offset) continue;
      if (selection) {
        if (i >= selection.length) break;
        index = selection[i];
      } else index = i;

      if (this.deleted[this.data[index]._INDEX]) continue; // use _INDEX in case data is_subset

      list.push(this.data[index]);
    }
    return list;
  }
}
