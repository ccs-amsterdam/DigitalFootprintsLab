import db from "apis/db";

const submitData = async (setStatus) => {
  setStatus([]);
  const meta = await db.idb.meta.get(1);
  const dataNames = await db.idb.data.toCollection().keys();

  postUserLogs(meta, setStatus);

  for (let name of dataNames) {
    const data = await db.getData(name);
    const testUser = meta.userId === "test_user";
    await postBody(name, meta.userId, data.n_deleted, data.data, setStatus, testUser, false);

    const metaData = [];
    // add metadata (validation and annotation questions) as separate array.
    // This is a bit hacky, but OSD2F seems to want an array.
    if (data.annotations)
      metaData.push({ type: "annotations", data: JSON.parse(data.annotations) });
    if (data.validation) metaData.push({ type: "validation", data: JSON.parse(data.validation) });

    if (metaData.length > 0)
      await postBody(name + " meta data", meta.userId, 0, metaData, setStatus, testUser, true);
  }
};

const postUserLogs = async (meta, setStatus) => {
  let log = await db.getLog();
  log = log.map((l) => l.log);
  const data = { user_agent: navigator.userAgent, log };
  await postBody("user_logs", meta.userId, 0, data, setStatus, false, true);
};

const postBody = async (filename, submission_id, n_deleted, entries, setStatus, fakeIt, isMeta) => {
  const body = { filename, submission_id, n_deleted, entries };
  const n = body.entries.length;
  if (fakeIt) body.entries = body.entries.map((e) => replaceWithFake(e));

  const requestOptions = {
    method: "POST",
    mode: "no-cors", // ok for now, but need to set up CORS on server
    //credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify([body]),
  };
  try {
    await fetch("https://digitale-voetsporen.nl/youtube/upload", requestOptions);
    if (!isMeta) setStatus((state) => [...state, { filename, success: true, n }]);
    // (for meta data, only show if it fails. eventually data + meta should just be 1 package)
  } catch (e) {
    console.log(e);
    setStatus((state) => [...state, { filename, success: false, n }]);
  }
};

const replaceWithFake = (obj) => {
  const newobj = {};
  for (let key of Object.keys(obj)) {
    const len = JSON.stringify(obj[key]).length;
    newobj[key] = "test ".repeat(Math.max(1, Math.floor(len / 5))).trim();
  }
  return newobj;
};

export default submitData;
