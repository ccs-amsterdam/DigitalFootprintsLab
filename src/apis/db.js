import { updateDomainInfo } from "components/explore/dashboardData/useDomainInfo";
import Dexie from "dexie";

// Simplified alternative to previous use of indexedDB, motivated by:
// - less dependencies
// - avoiding dexie live hooks, which might not be supported on all devices
// - we will now read full data (in a specific visualization) in memory anyway, so indexing is just a waste of time
// - without indexing we can also encrypt entries. For instance linked to encryption keys in temporary cookies
// - DB data type agnostic (not using different tables for types. components can figure that stuff out)

class FootprintDB {
  constructor() {
    // Dexie automatically checks whether a db with this name exists. If it does,
    // it opens the existing one, if it doesn't, it creates a new one.
    this.idb = new Dexie("FootprintDB"); // idb = indexedDB

    // the following 2 lines are only for developing
    // if enabled (i.e. not commented), the db resets every time the app is started (also when refreshing)
    // this.idb.delete();
    // this.idb = new Dexie("FootprintDB");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component. Eventually,
      //  this would be a good place to add authentication / token validation
      dataStatus: "&name, source, status, date",
      data: "&name, deleted", // unindexed fields: "data". "data" is an array with all the data. "deleted" requires some explanation.
      // data items can be deleted by users, but for speed we don't overwrite the data immediately,
      // and instead store the indices values of the deleted items. The format is a boolean array of same length as data
      domainInfo: "&domain", // unindexed: info
    });
  }

  async destroyEverything() {
    // reset database
    await this.idb.delete();
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

  /////// DATA

  async getData(name, fields) {
    try {
      let data = await this.idb.data.get({ name });
      // For speed and efficiency, data items are not immediately deleted from the database when they are removed
      // in the client but a lookup object for deleted indices is used (see note above in the IDB table declaration).
      if (data?.deleted) {
        data.data = data.data.filter((d, i) => !data.deleted[i]);
        await this.idb.data.put({ name, deleted: null, data: data.data }, [name]);
      }

      if (fields) {
        for (let i = 0; i < data.data.length; i++) {
          const item = {};
          for (let f of fields) item[f] = data.data[i][f];
          data.data[i] = item;
        }
      }

      for (let i = 0; i < data.data.length; i++) data.data[i]._INDEX = i;
      return data.data;
    } catch (e) {
      return null;
    }
  }

  async setDeleted(name, deleted) {
    await this.idb.data.where("name").equals(name).modify({ deleted });
  }

  // add data given name of data type (e.g., Browsing). idFields is an array of fields in data objects used to check for duplicates.
  // e.g. ['url','date']
  async addData(data, name, source, idFields = null) {
    let fulldata = await this.getData(name);

    const newDomains = {}; // also check for new domains, to immediately call backend for getting domaininfo
    if (fulldata && fulldata.data.length > 0) {
      const existing = {};
      if (idFields) {
        for (let d of data) {
          if (d.domain && !newDomains[d.domain]) newDomains[d.domain] = true;
          const id = JSON.stringify(idFields.map((f) => d[f]));
          existing[id] = true;
        }
      }
      for (let d of fulldata.data) {
        if (d.domain && newDomains[d.domain]) newDomains[d.domain] = false;
        if (idFields) {
          const id = JSON.stringify(idFields.map((f) => d[f]));
          if (existing[id]) continue;
        }
        data.push(d);
      }
    }

    await this.idb.data.put({ name, deleted: null, data }, [name]);
    await this.updateDataStatus(name, source);

    const addDomainInfo = Object.keys(newDomains).filter((domain) => newDomains[domain]);
    if (addDomainInfo.length > 0) updateDomainInfo(addDomainInfo);
  }

  /////// DATA STATUS

  async getDataStatus(name) {
    return this.idb.datastatus.get({ name });
  }

  async updateDataStatus(name, source) {
    // note that status is always set to finished.
    // whenever the datastatus table is updated, it its written to the dataStatus state (redux)
    // This way the 'loading' status can be triggered via dispatch, and is set to finished when the update is finished
    const current = await this.idb.dataStatus.get({ name });
    const date = new Date();
    if (current) {
      this.idb.dataStatus.where("name").equals(name).modify({ date, source, status: "finished" });
    } else {
      this.idb.dataStatus.add({ name, date, source, status: "finished" });
    }
  }

  /////// DOMAIN INFO

  async getDomainInfo(domains) {
    // returns an object where keys are domains and values are info
    const table = await this.idb.domainInfo.where("domain").anyOf(domains).toArray();
    return table.reduce((obj, row) => {
      obj[row.url] = row.info;
      return obj;
    }, {});
  }

  async addDomainInfo(domainInfo) {
    const data = Object.keys(domainInfo).map((key) => ({ domain: key, info: domainInfo[key] }));
    this.idb.domainInfo
      .bulkPut(data)
      .then()
      .catch(Dexie.BulkError, (e) => {
        console.log("ignored some duplicates in writeDomainInfo");
      });
  }
}

const db = new FootprintDB();
export default db;
