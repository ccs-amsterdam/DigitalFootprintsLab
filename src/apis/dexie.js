import Dexie from "dexie";
//import hash from "object-hash";

class AnnotationDB {
  constructor() {
    this.idb = new Dexie("DataDonationsLab");

    // the following 2 lines are only for developing
    // they reset the db every time the app is started (also when refreshing)
    //this.idb.delete();
    //this.idb = new Dexie("DataDonationsLab");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component
      browsinghistory: "id++, &[url+date], domain, date", // &[url+date] is unique compound key
      youtube: "id++, &[url+date], channel, date",
      platforms: "name",
    });
  }

  // META
  async welcome() {
    if (!(await this.isWelcome())) this.idb.meta.add({ welcome: 1 });
    return null;
  }
  async isWelcome() {
    return this.idb.meta.get(1);
  }

  // ANY TABLE DATA
  async getTableBatch(table, offset, limit) {
    if (offset !== null && offset < 0) return null;
    let rows = await this.idb.table(table);
    const n = await rows.count();
    if (offset !== null && offset > n - 1) return null;
    if (limit !== null) rows = rows.offset(offset).limit(limit);
    return rows.toArray();
  }

  async getTableFromIds(table, ids) {
    if (ids.length === 0) return [];
    return await this.idb
      .table(table)
      .where("id")
      .anyOf(ids)
      .toArray();
  }

  async getTableN(table) {
    let rows = await this.idb.table(table);
    return rows.count();
  }

  async deleteTableIds(table, ids) {
    if (ids.length === 0) return [];
    await this.idb
      .table(table)
      .where("id")
      .anyOf(ids)
      .delete();
  }

  // SEARCH TABLE DATA
  async getSelectionQuery(table, fields, query, key, any) {
    // table: what table to search
    // fields: what columns to search
    // query: direct text match
    // key, any: optionally, filter on an indexed key, where any is an array of values
    let regex = null;
    if (query !== "") regex = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/, "\\$&"), "i");
    let rows = await this.idb.table(table);

    let selection = [];
    let collection = any == null ? await rows.toCollection() : await rows.where(key).anyOf(any);

    await collection.each(row => {
      for (let field of fields) {
        if (regex === null) {
          selection.push(row.id);
          return;
        }
        if (regex.test(row[field])) {
          selection.push(row.id);
          return;
        }
      }
    });
    return selection;
  }

  async getSelectionAny(table, key, any) {
    let rows = await this.idb.table(table);
    return await rows
      .where(key)
      .anyOf(any)
      .primaryKeys();
  }

  async getSelectionRange(table, key, from, to) {
    let rows = await this.idb.table(table);
    if (from) rows = await rows.where(key).aboveOrEqual(from);
    if (to) rows = await rows.where(key).belowOrEqual(to);
    return await rows.primaryKeys();
  }

  // PLATFORMS
  async platformStatus(name) {
    return this.idb.platforms.get(name);
  }

  async updatePlatform(name) {
    // note that status is always set to finished. platform on db should only be updated on successful update
    // whenever the platforms table is updated, it its written to the platformStatus state (redux)
    // This way the 'loading' status can be triggered via dispatch, and is set to finished when the update is finished
    const current = await this.idb.platforms.get(name);
    if (current) {
      this.idb.platforms
        .where("name")
        .equals(name)
        .modify({ date: new Date(), status: "finished" });
    } else {
      this.idb.platforms.add({ name, date: new Date(), status: "finished" });
    }
  }

  async addData(data, table) {
    // build in duplicate check?
    return this.idb.table(table).bulkAdd(data);
  }
}

const db = new AnnotationDB();
export default db;
