import React from "react";
import GatherCard from "./GatherCard";

// Like explorecards, this creates the gather cards
// These are a bit more tricky because these create modals (instead of routing to a new page)
// The gather components therefore take the GatherCard as a child (used to trigger the modal)
// and a setLoading prop that reports the loading status of the gather script. (see GatherGoogleTakeout)

/**
 * Returns all gather cards to be rendered on the home page.
 */
const GatherCardColumn = () => {
  // Currently only uses google takeout, so it looks silly
  return (
    <>
      <GoogleTakeout />
    </>
  );
};

const gtDataMap = {
  "Chrome visited": "Browsing",
  "Chrome searched": "Search",
  "Youtube watched": "Youtube",
  "Youtube searched": "Search",
  "Youtube subscriptions": "Youtube",
};

/**
 * Renders the gather card for Google Takeout
 */
const GoogleTakeout = () => {
  return (
    <GatherCard
      name={"Google_Takeout"}
      subname={"takeout.google.com"}
      produces={Object.keys(gtDataMap)}
      icon={"google"}
    />
  );
};

export default GatherCardColumn;
