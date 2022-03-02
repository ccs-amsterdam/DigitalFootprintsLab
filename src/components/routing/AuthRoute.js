import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import db from "apis/db";
import { useSearchParams } from "react-router-dom";

/**
 * Handles authentication (which at the moment is just accepting the welcome message)
 * Redirects to the welcome pages if the condition in connect is not met.
 */
const AuthRoute = ({ children }) => {
  const [searchParams] = useSearchParams();
  const userId = searchParams.get("id");
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
  if (!hasdb) return <Navigate to={userId !== null ? `/?id=${userId}` : "/"} />;
  return children;
};

export default AuthRoute;
