import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderMenu from "./components/routing/HeaderMenu";
import "./App.css";

// login and authenticated route
import Welcome from "./components/routing/Welcome";
import AuthRoute from "./components/routing/AuthRoute";

// Main pages. Use below in items to include in header menu
import DataSquare from "./components/home/DataSquare";
import BrowsingHistory from "./components/explore/BrowsingHistory";
import YoutubeHistory from "./components/explore/YoutubeHistory";
import SearchHistory from "./components/explore/SearchHistory";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Data square", path: "/datasquare", Component: DataSquare },
  { label: "Browsing History", path: "/browsing", Component: BrowsingHistory },
  { label: "Search", path: "/search", Component: SearchHistory },
  { label: "Youtube", path: "/youtube", Component: YoutubeHistory },
];

const App = () => {
  const authRoutes = () => {
    return items.map((item) => {
      return (
        <Route
          key={item.label}
          path={item.path}
          element={
            <AuthRoute>
              <item.Component />
            </AuthRoute>
          }
        />
      );
    });
  };

  return (
    <div style={{ background: "#0C1D35", height: "100%" }}>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <HeaderMenu items={items}>
          <Routes>
            <Route exact path={"/"} element={<Welcome items={items} />} />
            {authRoutes()}
          </Routes>
        </HeaderMenu>
      </BrowserRouter>
    </div>
  );
};

export default App;
