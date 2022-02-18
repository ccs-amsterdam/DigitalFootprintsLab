import { updateGroupInfo } from "components/explore/dashboardData/useGroupInfo";
import Dexie from "dexie";
const indexedDB = require("fake-indexeddb");
const IDBKeyRange = require("fake-indexeddb/lib/FDBKeyRange");

// Simplified alternative to previous use of indexedDB, motivated by:
// - less dependencies
// - avoiding dexie live hooks, which might not be supported on all devices
// - we will now read full data (in a specific visualization) in memory anyway, so indexing is just a waste of time
// - without indexing we can also encrypt entries. For instance linked to encryption keys in temporary cookies
// - DB data type agnostic (not using different tables for types. components can figure that stuff out)

class FootprintDB {
  constructor() {
    this.setIDB();
  }

  setIDB(useFake = false) {
    // Dexie automatically checks whether a db with this name exists. If it does,
    // it opens the existing one, if it doesn't, it creates a new one.
    if (!useFake) {
      this.idb = new Dexie("DigitalFootprintDB");
    } else {
      this.idb = new Dexie("DigitalFootprintDB", {
        indexedDB: indexedDB,
        IDBKeyRange: IDBKeyRange,
      });
    }

    // the following 2 lines are only for developing
    // if enabled (i.e. not commented), the db resets every time the app is started (also when refreshing)
    //this.idb.delete();
    //this.idb = new Dexie("FootprintDB");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component.
      dataStatus: "&name, source, status, date",
      data: "&name, deleted", // unindexed fields: "data". "data" is an array with all the data. "deleted" requires some explanation.
      // data items can be deleted by users, but for speed we don't overwrite the data immediately,
      // and instead store the indices values of the deleted items. The format is a boolean array of same length as data
      groupInfo: "&group", // unindexed: info
    });
  }

  async destroyEverything() {
    // reset database
    await this.idb.delete();
  }

  // META
  /** just serves to indicate that user has accepted conditions at welcome screen */
  async welcome() {
    let persistent;
    try {
      await this.idb.meta.put({ welcome: 1 });
      persistent = true;
    } catch (e) {
      this.setIDB(true);
      await this.idb.meta.put({ welcome: 1 });
      persistent = false;
    }
    return persistent;
  }
  async isWelcome() {
    try {
      const welcome = await this.idb.meta.get(1);
      return { welcome: !!welcome, persistent: true };
    } catch (e) {
      // can throw error if browser can't handle IDB
      return { welcome: false, persistent: false };
    }
  }

  /////// DATA

  async getData(name, fields) {
    try {
      let data = await this.idb.data.get({ name });
      data.data = JSON.parse(data.data);
      // For speed and efficiency, data items are not immediately deleted from the database when they are removed
      // in the client but a lookup object for deleted indices is used (see note above in the IDB table declaration).
      if (data?.deleted) {
        data.data = data.data.filter((d, i) => !data.deleted[i]);
        await this.idb.data.put({ name, deleted: null, data: JSON.stringify(data.data) }, [name]);
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

    const newGroups = {}; // also check for new groups, to immediately call backend for getting groupinfo
    if (fulldata && fulldata.length > 0) {
      const existing = {};
      if (idFields) {
        for (let d of data) {
          if (d.group && !newGroups[d.group]) newGroups[d.group] = true;
          const id = JSON.stringify(idFields.map((f) => d[f]));
          existing[id] = true;
        }
      }
      for (let d of fulldata) {
        if (d.group && newGroups[d.group]) newGroups[d.group] = false;
        if (idFields) {
          const id = JSON.stringify(idFields.map((f) => d[f]));
          if (existing[id]) continue;
        }
        data.push(d);
      }
    }

    await this.idb.data.put({ name, deleted: null, data: JSON.stringify(data) }, [name]);
    await this.updateDataStatus(name, source);

    const addGroupInfo = Object.keys(newGroups).filter((group) => newGroups[group]);
    if (addGroupInfo.length > 0) updateGroupInfo(addGroupInfo);
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

  /////// Group INFO

  async getGroupInfo(groups) {
    // returns an object where keys are groups and values are info
    const table = await this.idb.groupInfo.where("group").anyOf(groups).toArray();
    return table.reduce((obj, row) => {
      obj[row.url] = row.info;
      return obj;
    }, {});
  }

  async addGroupInfo(groupInfo) {
    const data = Object.keys(groupInfo).map((key) => ({ group: key, info: groupInfo[key] }));
    this.idb.groupInfo
      .bulkPut(data)
      .then()
      .catch(Dexie.BulkError, (e) => {
        console.log("ignored some duplicates in writeGroupInfo");
      });
  }
}

let db = new FootprintDB();
export default db;
