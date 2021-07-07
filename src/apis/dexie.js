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
      browsing_history: "id++, domain, date, platform",
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

  // SEARCH TABLE DATA
  async getSelection(table, fields, query, key, any) {
    // table: what table to search
    // fields: what columns to search
    // query: direct text match
    // key, any: optionally, filter on an indexed key, where any is an array of values
    let regex = null;
    if (query !== "") regex = new RegExp(query.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"));

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
      this.idb.platform.get(name).modify({ date: new Date(), status: "finished" });
    } else {
      this.idb.platforms.add({ name, date: new Date(), status: "finished" });
    }
  }

  // BROWSING HISTORY
  async addBrowsingHistory(urls, platform) {
    // urls has to be an array with objects, that must have 'url', 'title' and 'date' keys

    // add domain and browser
    let urlsWithDomain = urls.map((url) => {
      let domain = new URL(url.url);
      url.domain = domain.hostname;
      url.platform = platform;
      url.filter = 0;
      return url;
    });

    return this.idb.browsing_history.bulkAdd(urlsWithDomain);
  }
}

const db = new AnnotationDB();
export default db;
