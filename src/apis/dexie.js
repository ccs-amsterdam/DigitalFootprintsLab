import Dexie from "dexie";
//import hash from "object-hash";

class AnnotationDB {
  constructor() {
    this.idb = new Dexie("DataDonationsLab");

    // the following 2 lines are only for developing
    // they reset the db every time the app is started (also when refreshing)
    this.idb.delete();
    this.idb = new Dexie("DataDonationsLab");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component
      data: "++id",
      browsing_history: "++id, domain, browser",

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

  // PLATFORMS
  async platformStatus(name) {
    return this.idb.platforms.get(name);
  }

  async updatePlatform(name) {
    // note that status is always finished. platform on db should only be updated on successful update
    // the status is for managing components in the current session, which is handled in the redux store.
    const current = await this.idb.platforms.get(name);
    if (current) {
      this.idb.platform.get(name).modify({ date: new Date(), status: "finished" });
    } else {
      this.idb.platforms.add({ name, date: new Date(), status: "finished" });
    }
  }

  // BROWSING HISTORY
  async addBrowsingHistory(urls, browser) {
    // urls has to be an array with objects, that must have 'url', 'title' and 'date' keys

    // add domain and browser
    let urlsWithDomain = urls.map((url) => {
      let domain = new URL(url.url);
      url.domain = domain.hostname;
      url.browser = browser;
      return url;
    });

    return this.idb.browsing_history.bulkAdd(urlsWithDomain);
  }
}

const db = new AnnotationDB();
export default db;
