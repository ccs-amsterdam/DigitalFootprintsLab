import React from "react";
import GatherCard from "./GatherCard";
import { gatherSettings } from "project/gatherSettings";

// Like explorecards, this creates the gather cards
// These are a bit more tricky because these create modals (instead of routing to a new page)
// The gather components therefore take the GatherCard as a child (used to trigger the modal)
// and a setLoading prop that reports the loading status of the gather script. (see GatherGoogleTakeout)

/**
 * Returns all gather cards to be rendered on the home page.
 */
const GatherCardColumn = () => {
  // Currently only uses google takeout, so it looks silly

  const cards = gatherSettings.map((gs) => {
    return (
      <GatherCard
        key={gs.name}
        name={gs.name}
        subname={gs.subname}
        produces={Object.keys(gs.importMap)}
        icon={gs.icon}
      />
    );
  });

  return <>{cards}</>;
};

export default GatherCardColumn;
