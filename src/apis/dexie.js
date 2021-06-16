import Dexie from "dexie";
//import hash from "object-hash";

class AnnotationDB {
  constructor() {
    this.idb = new Dexie("DataDonationsLab");
    this.idb.delete();
    this.idb = new Dexie("DataDonationsLab");

    this.idb.version(2).stores({
      meta: "welcome", // this just serves to keep track of whether db was 'created' via the welcome component
      data: "++id",
      urls: "++id, domain",
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

  // URLS
  async addUrls(urls) {
    // urls has to be an array with objects, that must have 'url', 'title' and 'date' keys

    // add domain
    let urlsWithDomain = urls.map((url) => {
      let domain = new URL(url.url);
      url.domain = domain.hostname;
      return url;
    });

    return this.idb.urls.bulkAdd(urlsWithDomain);
  }
}

const db = new AnnotationDB();
export default db;
