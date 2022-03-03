import db from "apis/db";

const submitData = async (setStatus) => {
  setStatus([]);
  const meta = await db.idb.meta.get(1);
  const dataNames = await db.idb.data.toCollection().keys();

  for (let name of dataNames) {
    const data = await db.getData(name);
    const testUser = meta.userId === "test_user";
    await postBody(name, meta.userId, data.n_deleted, data.data, setStatus, testUser);

    if (data.annotations) {
      data.annotations = JSON.parse(data.annotations);
      const annotationEntries = [];
      for (let field of Object.keys(data.annotations)) {
        for (let value of Object.keys(data.annotations[field])) {
          annotationEntries.push({ field, value, annotation: data.annotations[field][value] });
        }
      }
      await postBody(
        name + " annotations",
        meta.userId,
        data.n_deleted,
        annotationEntries,
        setStatus,
        testUser
      );
    }
  }
};

const postBody = async (filename, submission_id, n_deleted, entries, setStatus, testUser) => {
  console.log(testUser);
  const body = { filename, submission_id, n_deleted, entries };
  const n = body.entries.length;
  if (testUser) body.entries = body.entries.map((e) => replaceWithFake(e));

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
    const response = await fetch("https://digitale-voetsporen.nl/youtube/upload", requestOptions);
    console.log(response);
    setStatus((state) => [...state, { filename, success: true, n }]);
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
