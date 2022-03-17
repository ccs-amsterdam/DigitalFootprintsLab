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
      db.log(where, what);
    },
    [where]
  );

  useEffect(() => {
    db.log(where, what);
  }, [where, what]);

  return log;
};

export default useLogger;
