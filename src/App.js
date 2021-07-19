import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import HeaderMenu from "./components/HeaderMenu";
import "./App.css";

// login and authenticated route
import Welcome from "./components/Welcome";
import AuthRoute from "./components/AuthRoute";

// Main pages. Use below in items to include in header menu
import DataSquare from "./components/DataSquare";
import BrowsingHistory from "./components/BrowsingHistory";
import YoutubeHistory from "./components/YoutubeHistory";
import SearchHistory from "./components/SearchHistory";
import Survey from "./components/Survey";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Data square", path: "/datasquare", Component: DataSquare },
  { label: "Browsing History", path: "/browsinghistory", Component: BrowsingHistory },
  { label: "Search", path: "/searchhistory", Component: SearchHistory },
  { label: "Youtube", path: "/youtube", Component: YoutubeHistory },
  { label: "Survey", path: "/survey", Component: Survey },
];

const App = () => {
  const createNavigation = items => {
    return items.map(item => {
      return <AuthRoute key={item.path} path={item.path} Component={item.Component} />;
    });
  };

  return (
    <div style={{ background: "#0C1D35", height: "100%" }}>
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
