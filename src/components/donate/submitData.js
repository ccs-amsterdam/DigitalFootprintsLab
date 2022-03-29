import db from "apis/db";

const submitData = async (setStatus) => {
  setStatus([]);
  const dataNames = await db.idb.data.toCollection().keys();
  const meta = await db.idb.meta.get(1);
  const testUser = meta.userId === "test_user";

  postAnswers(meta, testUser, setStatus);
  postUserLogs(meta, setStatus);
  for (let name of dataNames) postData(meta, name, testUser, setStatus);
};

const postAnswers = async (meta, testUser, setStatus) => {
  let answers = meta.questions ? JSON.parse(meta.questions) : {};
  // answers is an object, so first convert to array
  answers = Object.keys(answers).map((key) => ({ question: key, ...answers[key] }));
  await postBody("answers", meta.userId, 0, answers, setStatus, testUser, true);
};

const postUserLogs = async (meta, setStatus) => {
  let log = await db.getLog();
  log = log.map((l) => l.log);
  const data = { user_agent: navigator.userAgent, log };
  await postBody("user_logs", meta.userId, 0, data, setStatus, false, true);
};

const postData = async (meta, name, testUser, setStatus) => {
  const data = await db.getData(name);
  await postBody(name, meta.userId, data.n_deleted, data.data, setStatus, testUser, false);

  const metaData = [];
  // add metadata (validation questions) as separate array.
  // This is a bit hacky, but OSD2F seems to want an array.
  if (data.validation) metaData.push({ type: "validation", data: JSON.parse(data.validation) });

  if (metaData.length > 0)
    await postBody(name + " meta data", meta.userId, 0, metaData, setStatus, testUser, true);
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

  console.log(filename, body);
  try {
    await fetch("https://digitale-voetsporen.nl/youtube/upload", requestOptions);
    if (!isMeta) setStatus((state) => [...state, { filename, success: true, n }]);
    // (for meta data, only show status if it fails. eventually data + meta should just be 1 package)
  } catch (e) {
    console.log(e);
    setStatus((state) => [...state, { filename, success: false, n }]);
  }
};

const replaceWithFake = (obj) => {
  const newobj = {};
  let i = 1;
  for (let key of Object.keys(obj)) {
    const len = JSON.stringify(obj[key]).length;
    newobj["item" + i++] = "test ".repeat(Math.max(1, Math.floor(len / 5))).trim();
  }
  return newobj;
};

export default submitData;
