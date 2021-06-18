import React, { useState } from "react";
import { Icon } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import GatherGoogleTakeout from "./GatherGoogleTakeout";

// Like platformcards, this creates the gather cards
// These are a bit more tricky because these create modals (instead of routing to a new page)
// The gather components therefore take the GatherCard as a child (used to trigger the modal)
// and a setLoading prop that reports the loading status of the gather script. (see GatherGoogleTakeout)

const GatherCards = () => {
  return <GoogleTakeout />;
};

const GoogleTakeout = () => {
  const [loading, setLoading] = useState("idle");
  return (
    <GatherGoogleTakeout setLoading={setLoading}>
      <GatherCard
        name={"Google"}
        subname={"takeout.google.com"}
        icon={"google"}
        loading={loading}
      />
    </GatherGoogleTakeout>
  );
};

const GatherCard = ({ name, subname, icon, onClick, loading }) => {
  const statusMessage = (loading) => {
    if (loading === "failed")
      return (
        <>
          <Icon name="close" color="red" />
          <i>Something went wrong :(</i>
        </>
      );
    if (loading === "finished")
      return (
        <>
          <Icon name="checkmark" color="green" />
          <i>Data succesfully imported</i>
        </>
      );
    return <i>Click here to gather data</i>;
  };

  return (
    <CardTemplate name={name} subname={subname} icon={icon} onClick={onClick} loading={loading}>
      {statusMessage(loading)}
    </CardTemplate>
  );
};

export default GatherCards;
