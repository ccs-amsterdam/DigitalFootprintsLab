import React from "react";

import ExploreCard from "./ExploreCard";

/**
 * Returns all explore cards to be rendered on the home page.
 */
const ExploreCardColumn = () => {
  return (
    <>
      <Browsing />
      <Search />
      <Youtube />
    </>
  );
};

const Browsing = () => {
  return <ExploreCard name={"Browsing"} subname={"What pages did you visit?"} icon={"history"} />;
};

const Search = () => {
  return <ExploreCard name={"Search"} subname={"What did you search for?"} icon={"search"} />;
};

const Youtube = () => {
  return <ExploreCard name={"Youtube"} subname={"Channels and videos"} icon={"youtube"} />;
};

export default ExploreCardColumn;
