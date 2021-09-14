import Dexie from "dexie";
//import hash from "object-hash";

/**
 * Creates an instance of AnnotationDB, which is just a dexie db with some bells and whistles.
 */
class AnnotationDB {
  constructor() {
    // Dexie automatically checks whether a db with this name exists. If it does,
    // it opens the existing one, if it doesn't, it creates a new one.
    this.idb = new Dexie("DataDonationsLab"); // idb = indexedDB

    // the following 2 lines are only for developing
    // if enabled (i.e. not commented), the db resets every time the app is started (also when refreshing)
    this.idb.delete();
    this.idb = new Dexie("DataDonationsLab");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component. Eventually, this would be a good place to add authentication / token validation
      browsinghistory: "id++, &[url+date], domain, date", // id++ auto increments ; &[url+date] is unique compound key
      youtube: "id++, &[url+date], channel, date",
      searchhistory: "id++, &[query+date], *word, date", // *word is a multientry index that takes an array of words
      datastatus: "name", // names should be the name of a table (browsinghistory, youtube, etc.). Used to keep track of status
    });
  }

  // META
  /** just serves to indicate that user has accepted conditions at welcome screen */
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
    return await this.idb.table(table).where("id").anyOf(ids).toArray();
  }

  async getTableN(table) {
    let rows = await this.idb.table(table);
    return rows.count();
  }

  async deleteTableIds(table, ids) {
    if (ids.length === 0) return [];
    await this.idb.table(table).where("id").anyOf(ids).delete();
  }

  /**
   * text search data in table
   * @param {string} table  Name of a table
   * @param {array} fields  Names of the fields to search
   * @param {string} query  A string to search for
   * @param {string} key    Optionally, filter on an indexed 'key' before performing the fulltext search.
   * @param {array} any     If key is used, any should be an array of values
   * @returns
   */
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

    await collection.each((row) => {
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
    return await rows.where(key).anyOf(any).primaryKeys();
  }

  async getSelectionRange(table, key, from, to) {
    let rows = await this.idb.table(table);

    const start = from || new Date(1000, 1, 1);
    const end = to || new Date(3000, 1, 1);

    return await rows.where(key).between(start, end, true, true).reverse().primaryKeys();
  }

  // DATA STATUS
  async dataStatus(name) {
    return this.idb.datastatus.get(name);
  }

  async updateDataStatus(name) {
    // note that status is always set to finished.
    // whenever the datastatus table is updated, it its written to the dataStatus state (redux)
    // This way the 'loading' status can be triggered via dispatch, and is set to finished when the update is finished
    const current = await this.idb.datastatus.get(name);
    if (current) {
      this.idb.datastatus
        .where("name")
        .equals(name)
        .modify({ date: new Date(), status: "finished" });
    } else {
      this.idb.datastatus.add({ name, date: new Date(), status: "finished" });
    }
  }

  async addData(data, table) {
    // The unique compound index &[url+date] ensures no duplicates
    // Dexie will throw an error for this, but apparently you can catch it
    // and then dexie will continue uploading the other items
    // (https://dexie.org/docs/Table/Table.bulkPut())
    this.idb
      .table(table)
      .bulkPut(data)
      .then((lastKey) => {
        console.log("uploaded all data items");
      })
      .catch(Dexie.BulkError, (e) => {
        console.log(`Failed to upload ${e.failures.length} data items`);
      });
  }
}

const db = new AnnotationDB();
export default db;
