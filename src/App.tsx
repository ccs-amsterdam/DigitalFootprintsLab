import React, { Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import HeaderMenu from "./components/routing/HeaderMenu";
import "./App.css";

// login and authenticated route
import Welcome from "./components/routing/Welcome";
import InitRoute from "./components/routing/InitRoute";

// Main pages. Use below in items to include in header menu
import DataSquare from "./components/home/DataSquare";
import BrowsingHistory from "./components/explore/BrowsingHistory";
import YoutubeHistory from "./components/explore/YoutubeHistory";
import SearchHistory from "./components/explore/SearchHistory";
import RemoveData from "./components/donate/RemoveData";
import DonationScreen from "components/donate/DonationScreen";
import usePersistance from "components/routing/usePersistence";
import GatherScreen from "components/gather/GatherScreen";
import useWindowSize from "util/useWindowSize";
import background from "images/background.jpeg";

// Change to add new components to the header
// The first item will be the opening page after login
const items = [
  { label: "Data square", path: "/datasquare", Component: DataSquare },
  { label: "Gather", path: "/gather/*", Component: GatherScreen },
  { label: "Browsing", path: "/browsing", Component: BrowsingHistory },
  { label: "Search", path: "/search", Component: SearchHistory },
  { label: "Youtube", path: "/youtube", Component: YoutubeHistory },
  { label: "Remove", path: "/remove", Component: RemoveData },
  { label: "Donate", path: "/donate", Component: DonationScreen },
];

const Page = () => {
  // The usePersistance hook checks if the redux 'persistant' state is false, and if so warn
  // users if they try to refresh, leave or close the browser that their data will be gone
  usePersistance();
  const size = useWindowSize();

  return (
    <div
      style={{
        backgroundImage: background ? `url(${background})` : "none",
        backgroundSize: `100vw 100vh`,
        height: `${size.height}px`,
        width: `${size.width}px`,
      }}
    >
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <div style={{}}>
            <HeaderMenu items={items} />
          </div>
          <div style={{ flex: "1 1 auto", overflow: "auto", marginBottom: "auto" }}>
            <Routes>
              <Route path={"/"} element={<Welcome items={items} />} />
              {items.map((item) => {
                return (
                  <Route
                    key={item.label}
                    path={item.path}
                    element={
                      <InitRoute>
                        <item.Component />
                      </InitRoute>
                    }
                  />
                );
              })}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

// loading component for suspense fallback
const Loader = () => (
  <div className="App">
    <div>loading...</div>
  </div>
);

export default function App() {
  return (
    <Suspense fallback={<Loader />}>
      <Page />
    </Suspense>
  );
}
