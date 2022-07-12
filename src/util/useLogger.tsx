import db from "apis/db";
import { useEffect, useCallback } from "react";

/**
 * A hook for the logger. Should be used in top level components.
 * It logs "open" when the component mounts, and returns a function
 * that can be used to log specific actions.
 * @param {*} where The name of a location. e.g., "Explore Browsing data"
 * @returns
 */
const useLogger = (where, what = "open") => {
  const log = useCallback(
    (what) => {
      postLog(where, what);
    },
    [where]
  );

  useEffect(() => {
    postLog(where, what);
  }, [where, what]);

  return log;
};

const postLog = async (what, where) => {
  const date = new Date();
  const log = [{ what, where, date: date.toISOString() }]; // needs to be an array for current endpoint (osd2f)
  const meta = await db.idb.meta.get(1);

  const body = { filename: "user_logs", submission_id: meta.userId, n_deleted: 0, entries: log };

  const requestOptions: RequestInit = {
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
  } catch (e) {
    console.log(e);
  }
};

export default useLogger;
