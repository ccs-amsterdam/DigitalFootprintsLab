import Dexie from "dexie";

// Simplified alternative to previous use of indexedDB, motivated by:
// - less complexity
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
      dataStatus: "&name, status, date, n",
      data: "&name, deleted", // unindexed fields: "data". "data" is an array with all the data, and deleted a bool array
      // of the lenght of data telling if an item has been delete. This way deleted can be quickly updated without overwriting all data.
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

  async getData(name, fields) {
    try {
      let data = await this.idb.data.get({ name });
      // For speed and efficiency, data items are not immediately deleted from the database when they are removed
      // in the client. Instead, this.setDeleted adds a boolean vector indicating which items have been deleted,
      // and this will be processed every time before getData is used.
      if (data?.deleted) {
        data.data = data.deleted.reduce((d, is_deleted, i) => {
          if (!is_deleted) d.push(data.data[i]);
          return d;
        }, []);
        await this.idb.data.put({ name, deleted: null, data: data.data }, [name]);
      }
      if (!fields) return data.data;

      return data.data.map((d) => {
        return fields.reduce((item, f) => {
          item[f] = d[f];
          return item;
        }, {});
      });
    } catch (e) {
      console.log(e);
      return null;
    }
  }

  async setDeleted(name, deleted) {
    await this.idb.data.where("name").equals(name).modify({ deleted });
  }

  // add data given name of data type (e.g., browsingHistory). idFields is an array of fields in data objects used to check for duplicates.
  // e.g. ['url','date']
  async addData(data, name, idFields = null) {
    let fulldata = await this.getData(name);

    if (fulldata && fulldata.data.length > 0) {
      const existing = {};
      if (idFields) {
        for (let d of data) {
          const id = JSON.stringify(idFields.map((f) => d[f]));
          existing[id] = true;
        }
      }
      for (let d of fulldata.data) {
        if (idFields) {
          const id = JSON.stringify(idFields.map((f) => d[f]));
          if (existing[id]) continue;
        }
        data.push(d);
      }
    }

    await this.idb.data.put({ name, deleted: null, data }, [name]);
    await this.updateDataStatus(name, data.length);
  }

  async getDataStatus(name) {
    return this.idb.datastatus.get({ name });
  }

  async updateDataStatus(name, n) {
    // note that status is always set to finished.
    // whenever the datastatus table is updated, it its written to the dataStatus state (redux)
    // This way the 'loading' status can be triggered via dispatch, and is set to finished when the update is finished
    const current = await this.idb.dataStatus.get({ name });
    const date = new Date();
    if (current) {
      this.idb.dataStatus.where("name").equals(name).modify({ date, status: "finished", n });
    } else {
      this.idb.dataStatus.add({ name, date, status: "finished", n });
    }
  }
}

const db = new FootprintDB();
export default db;
