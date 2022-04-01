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
      this.idb = new Dexie("DigitalFootprintDB_v0.1");
    } else {
      this.idb = new Dexie("DigitalFootprintDB_v0.1", {
        indexedDB: indexedDB,
        IDBKeyRange: IDBKeyRange,
      });
    }

    // the following 2 lines are only for developing
    // if enabled the db resets every time the app is started (also when refreshing)
    //this.idb.delete();
    //this.idb = new Dexie("FootprintDB");

    this.idb.version(2).stores({
      meta: "welcome", // Keep track of whether user logged in before, and remember userId (if passed as URL parameter)
      log: "++id", // unindexed: log. See utils/useLogger
      data: "&name, deleted", // unindexed fields: "data". "data" is an array with all the data. "deleted" requires some explanation.
      // data items can be deleted by users, but for speed we don't overwrite the data immediately,
      // and instead store the indices values of the deleted items. The format is a boolean array of same length as data
      groupInfo: "&group", // unindexed: info
    });
  }

  async destroyEverything() {
    // reset database. Returns userId so that it can be included in redirect
    const meta = await db.idb.meta.get(1);
    await this.idb.delete();
    return meta.userId;
  }

  // META
  /** keeps track of user information, like user id, return url, and answers to questions */
  async welcome(userId, returnURL) {
    let persistent;
    try {
      await this.idb.meta.put({ welcome: 1, userId, returnURL });
      persistent = true;
    } catch (e) {
      this.setIDB(true); // switch to fake idb
      await this.idb.meta.put({ welcome: 1, userId, returnURL });
      persistent = false;
    }
    return persistent;
  }
  async isWelcome() {
    try {
      const welcome = await this.idb.meta.get(1);
      return {
        welcome: !!welcome,
        persistent: true,
        userId: welcome?.userId,
        returnURL: welcome?.returnURL,
      };
    } catch (e) {
      // can throw error if browser can't handle IDB
      return { welcome: false, persistent: false, userId: null, returnURL: null };
    }
  }

  async setDonationStep(step) {
    // for keeping track of the step in the dontation screen.
    // note that this needs to be reset whenever data is modified
    // - when data is added, step can max be 1
    // - when data is deleted, step can max be 2
    await this.idb.meta.where("welcome").equals(1).modify({ donationStep: step });
  }

  async getDonationStep() {
    const meta = await this.idb.meta.get(1);
    return meta.donationStep || 0;
  }

  async setMaxDonationStep(maxStep) {
    let step = await this.getDonationStep();
    if (step > maxStep) step = maxStep;
    await this.setDonationStep(step);
  }

  /////// LOG
  async log(where, what) {
    const date = new Date();
    //console.log({ where, what, date: date.toISOString() });
    await this.idb.log.add({ log: { where, what, date: date.toISOString() } });
  }
  async getLog() {
    let data = await this.idb.log.toArray();
    return data;
  }

  /////// DATA

  async getData(name, fields) {
    try {
      let data = await this.idb.data.get({ name });
      data.data = JSON.parse(data.data);
      // For speed and efficiency, data items are not immediately deleted from the database when they are removed
      // in the client but a lookup object for deleted indices is used (see note above in the IDB table declaration).
      if (data?.deleted) {
        const n_before = data.data.length;
        data.data = data.data.filter((d, i) => !data.deleted[i]);
        let n_deleted = data.data.n_deleted || 0;
        n_deleted += n_before - data.data.length;
        await this.idb.data.put(
          { name, deleted: null, n_deleted, data: JSON.stringify(data.data) },
          [name]
        );
      }

      if (fields) {
        for (let i = 0; i < data.data.length; i++) {
          const item = {};
          for (let f of fields) item[f] = data.data[i][f];
          data.data[i] = item;
        }
      }

      for (let i = 0; i < data.data.length; i++) data.data[i]._INDEX = i;
      return data;
    } catch (e) {
      return null;
    }
  }

  async setDeleted(name, deleted) {
    await this.idb.data.where("name").equals(name).modify({ deleted });
    await this.setMaxDonationStep(2);
  }

  // add data given name of data type (e.g., Browsing). idFields is an array of fields in data objects used to check for duplicates.
  // e.g. ['url','date']
  async addData(data, name, platform, source, idFields = null) {
    let fulldata = await this.getData(name);

    //const date = new Date();
    for (let row of data) {
      row._platform = platform;
      row._source = source;
      //row._date = date;
    }

    const newGroups = {}; // also check for new groups, to immediately call backend for getting groupinfo
    if (fulldata && fulldata.data.length > 0) {
      const existing = {};

      for (let d of data) {
        if (d.group && !newGroups[d.group]) newGroups[d.group] = true;
        const id = JSON.stringify(idFields.map((f) => d[f]));
        existing[id] = true;
      }
      for (let d of fulldata.data) {
        if (d.group && newGroups[d.group]) newGroups[d.group] = false;
        const id = JSON.stringify(idFields.map((f) => d[f]));
        if (existing[id]) continue;
        data.push(d);
      }
    }

    await this.idb.data.put({ name, deleted: null, n_deleted: 0, data: JSON.stringify(data) }, [
      name,
    ]);
    await this.setMaxDonationStep(1);

    const addGroupInfo = Object.keys(newGroups).filter((group) => newGroups[group]);
    if (addGroupInfo.length > 0) updateGroupInfo(addGroupInfo);
  }

  async setAnswers(question, answers) {
    const meta = await this.idb.meta.get(1);
    const questions = meta.questions ? JSON.parse(meta.questions) : {};
    questions[question] = answers;
    await this.idb.meta.update(1, { questions: JSON.stringify(questions) });
  }

  async getAnswers(question) {
    const meta = await this.idb.meta.get(1);
    const questions = meta.questions ? JSON.parse(meta.questions) : {};
    return questions[question];
  }

  async setDataValidation(validation, name) {
    await this.idb.data.update(name, { validation: JSON.stringify(validation) });
  }

  async getDataValidation(name) {
    let data = await this.idb.data.get({ name });
    if (data?.validation) return JSON.parse(data.validation);
    return {};
  }

  /////// DATA STATUS

  async getDataStatus(name) {
    let allStatuses = [];
    await this.idb.data.each((d) => {
      d.data = JSON.parse(d.data);
      if (d?.deleted) d.data = d.data.filter((row, i) => !d.deleted[i]);

      const statuses = {};
      for (let row of d.data) {
        const key = `${d.name} - ${row._source}`;

        if (!statuses[key])
          statuses[key] = {
            name: d.name,
            platform: row._platform,
            source: row._source,
            //date: new Date(row._date),
            count: 0,
          };
        statuses[key].count++;
      }
      allStatuses = [...allStatuses, ...Object.values(statuses)];
    });
    return allStatuses;
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
