import db from "apis/db";

const submitData = async (status, setStatus) => {
  const dataNames = await db.idb.data.toCollection().keys();
  const meta = await db.idb.meta.get(1);
  const testUser = meta.userId === "test_user";
  const finished = { finished: true }; // will be set to false if one of the postBody fails

  await postAnswers(meta, testUser, status, setStatus, finished);
  await postUserLogs(meta, status, setStatus, finished);
  for (let name of dataNames) await postData(meta, name, testUser, status, setStatus, finished);

  return finished.finished;
};

const postAnswers = async (meta, testUser, status, setStatus, finished) => {
  let answers = meta.questions ? JSON.parse(meta.questions) : {};
  // answers is an object, so first convert to array
  answers = Object.keys(answers).map((key) => ({ question: key, ...answers[key] }));
  await postBody("answers", meta.userId, 0, answers, status, setStatus, testUser, true, finished);
};

const postUserLogs = async (meta, status, setStatus, finished) => {
  let log = await db.getLog();
  log = log.map((l) => l.log);
  await postBody("user_logs", meta.userId, 0, log, status, setStatus, false, true, finished);
  const userMeta = [{ user_agent: navigator.userAgent }];
  await postBody("user_meta", meta.userId, 0, userMeta, status, setStatus, false, true, finished);
};

const postData = async (meta, name, testUser, status, setStatus, finished) => {
  const data = await db.getData(name);
  await postBody(
    name,
    meta.userId,
    data.n_deleted,
    data.data,
    status,
    setStatus,
    testUser,
    false,
    finished
  );

  const metaData = [];
  // add metadata (validation questions) as separate array.
  // This is a bit hacky, but OSD2F seems to want an array.
  if (data.validation) metaData.push({ type: "validation", data: JSON.parse(data.validation) });

  if (metaData.length > 0)
    await postBody(
      name + " meta data",
      meta.userId,
      0,
      metaData,
      status,
      setStatus,
      testUser,
      true,
      finished
    );
};

const postBody = async (
  filename,
  submission_id,
  n_deleted,
  entries,
  status,
  setStatus,
  fakeIt,
  isMeta,
  finished
) => {
  // if file has already successfully been uploaded, skip it
  if (status.find((s) => s.filename === filename && s.success)) return null;

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
    if (!isMeta)
      setStatus((state) => {
        // update current state, minus file of the same name (which can only happen if it failed before)
        const newState = [...state].filter((s) => s.filename !== filename);
        newState.push({ filename, success: true, n });
        return newState;
      });
    // (for meta data, only show status if it fails. eventually data + meta should just be 1 package)
  } catch (e) {
    console.log(e);
    setStatus((state) => {
      const newState = [...state].filter((s) => s.filename !== filename);
      newState.push({ filename, success: false, n });
      return newState;
    });
    finished.finished = false;
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
