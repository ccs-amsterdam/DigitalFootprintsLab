import { useEffect, useState } from "react";
import db from "apis/db";
import DashboardData from "./DashboardData";

/**
 * Get a dataset as a DashboardData class, with methods for searching, counting and filtering the data.
 *
 * @param {*} name     Name in db.data
 * @param {*} fields   An array with fieldnames from data to use
 * @returns
 */
export default function useDashboardData(name: string, fields?: string[]): any {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (!name) {
      setData(null);
      return;
    }
    createDashData(name, fields, setData);
  }, [name, fields]);

  return data;
}

const createDashData = async (name, fields, setData) => {
  try {
    const data = await db.getData(name, fields);
    const dashData = new DashboardData(name, data.data, setData); // with setData, dashboard can trigger its own state update
    setData(dashData);
  } catch (e) {
    console.log(e);
    setData(null);
  }
};
