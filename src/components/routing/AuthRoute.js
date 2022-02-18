import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import db from "apis/db";

/**
 * Handles authentication (which at the moment is just accepting the welcome message)
 * Redirects to the welcome pages if the condition in connect is not met.
 */
const AuthRoute = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [hasdb, setHasdb] = useState(false);

  useEffect(() => {
    const connect = async () => {
      const welcome = await db.isWelcome();
      if (welcome?.welcome) {
        setHasdb(true);
      } else {
        setHasdb(false);
      }
      setLoading(false);
    };
    connect();
  });

  if (loading) return <div>loading...</div>;
  if (!hasdb) return <Navigate to={`/`} />;
  return children;
};

export default AuthRoute;
