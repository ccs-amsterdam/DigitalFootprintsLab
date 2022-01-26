import React, { useState } from "react";
import GatherCard from "./GatherCard";
import GatherGoogleTakeout from "components/gather/GatherGoogleTakeout";

// Like explorecards, this creates the gather cards
// These are a bit more tricky because these create modals (instead of routing to a new page)
// The gather components therefore take the GatherCard as a child (used to trigger the modal)
// and a setLoading prop that reports the loading status of the gather script. (see GatherGoogleTakeout)

/**
 * Returns all gather cards to be rendered on the home page.
 */
const GatherCardColumn = () => {
  // Currently only uses google takeout, so it looks silly
  return <GoogleTakeout />;
};

/**
 * Renders the gather card for Google Takeout
 */
const GoogleTakeout = () => {
  const [loading, setLoading] = useState("idle");

  // yes, it looks weird that the GatherCard is a child of the GatherGoogleTakeout
  // the reason is that GatherGoogleTakeout is a popup, and the GatherCard is the trigger
  return (
    <GatherGoogleTakeout setLoading={setLoading}>
      <GatherCard
        source={"Google_Takeout"}
        subname={"takeout.google.com"}
        produces={["Browsing_history", "Search_history", "Youtube"]}
        icon={"google"}
        loading={loading}
      />
    </GatherGoogleTakeout>
  );
};

export default GatherCardColumn;
