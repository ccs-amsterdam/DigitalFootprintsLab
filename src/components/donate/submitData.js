import db from "apis/db";

const submitData = async (setStatus) => {
  setStatus([]);
  const meta = await db.idb.meta.get(1);
  const dataNames = await db.idb.data.toCollection().keys();

  for (let name of dataNames) {
    const data = await db.getData(name);
    const testUser = meta.userId === "test_user";
    if (testUser)
      data.data = [{ test: "test submission. Only number of items", rows: data.data.length }];

    await postBody(name, meta.userId, data.n_deleted, data.data, setStatus);

    if (data.annotations) {
      data.annotations = JSON.parse(data.annotations);
      const annotationEntries = [];
      for (let field of Object.keys(data.annotations)) {
        if (testUser) {
          annotationEntries.push({
            field,
            value: "test submission. Only number of annotations",
            annotation: `${Object.keys(data.annotations[field]).length} annotations`,
          });
          continue;
        }
        for (let value of Object.keys(data.annotations[field])) {
          annotationEntries.push({ field, value, annotation: data.annotations[field][value] });
        }
      }
      await postBody(
        name + " annotations",
        meta.userId,
        data.n_deleted,
        annotationEntries,
        setStatus
      );
    }
  }
};

const postBody = async (filename, submission_id, n_deleted, entries, setStatus) => {
  const body = { filename, submission_id, n_deleted, entries };
  const requestOptions = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  };
  try {
    const response = await fetch("https://digitale-voetsporen.nl/browsing/upload", requestOptions);
    console.log(response);
    setStatus((state) => [...state, { filename, success: true }]);
  } catch (e) {
    console.log(e);
    setStatus((state) => [...state, { filename, success: false }]);
  }
};

export default submitData;
