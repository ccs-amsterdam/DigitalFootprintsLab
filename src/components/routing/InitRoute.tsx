import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import db from "apis/db";
import { useSearchParams } from "react-router-dom";
import { urlParamString } from "util/tools";

/**
 * Ensures that users have accepted any conditions specified at welcome, and
 * that db has been created.
 */
const InitRoute = ({ children }) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
  const returnURL = searchParams.get("return");
  const [loading, setLoading] = useState(true);
  const [hasdb, setHasdb] = useState(false);

  useEffect(() => {
    const connect = async () => {
      const welcome = await db.isWelcome();
      if (welcome?.welcome && (userId === null || welcome.userId === userId)) {
        setHasdb(true);
      } else {
        setHasdb(false);
      }
      setLoading(false);
    };
    connect();
  }, [userId]);

  if (loading) return <div>loading...</div>;

  const paramstring = urlParamString({ id: userId, return: returnURL });
  if (!hasdb) return <Navigate to={"/" + paramstring} />;
  return children;
};

export default InitRoute;
