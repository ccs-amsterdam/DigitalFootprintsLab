import React, { useState } from "react";
import { Route, Redirect } from "react-router";
import db from "apis/dexie";

/**
 * Handles authentication (which at the moment is just accepting the welcome message)
 * Redirects to the welcome pages if the condition in connect is not met.
 */
const AuthRoute = ({ Component, ...componentProps }) => {
  const [loading, setLoading] = useState(true);
  const [hasdb, setHasdb] = useState(false);
  // the weird trick for passing on componentProps is basically
  // redundant with Redux, but leaving it intact just in case

  const connect = async () => {
    if (await db.isWelcome()) {
      setHasdb(true);
    } else {
      setHasdb(false);
    }
    setLoading(false);
  };

  connect();

  return (
    <Route
      {...componentProps}
      render={(props) =>
        loading ? (
          <div>loading...</div>
        ) : hasdb ? (
          <Component {...componentProps} {...props} />
        ) : (
          <Redirect to={"/"} />
        )
      }
    />
  );
};

export default AuthRoute;
