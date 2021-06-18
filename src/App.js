import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";

// login and authenticated route
import Welcome from "./components/Welcome";
import AuthRoute from "./components/AuthRoute";

// Main pages. Use below in items to include in header menu
import DataSquare from "./components/DataSquare";
import BrowsingHistory from "./components/BrowsingHistory";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Data square", path: "/datasquare", Component: DataSquare },
  { label: "BrowsingHistory", path: "/browsinghistory", Component: BrowsingHistory },
];

const App = () => {
  const createNavigation = (items) => {
    return items.map((item) => {
      return <AuthRoute key={item.path} path={item.path} Component={item.Component} />;
    });
  };

  return (
    <div style={{ background: "#0C1D35" }}>
      <BrowserRouter>
        <HeaderMenu items={items}>
          <Switch>
            <Route exact path={"/"} render={() => <Welcome items={items} />} />
            {createNavigation(items)}
          </Switch>
        </HeaderMenu>
      </BrowserRouter>
    </div>
  );
};

export default App;
