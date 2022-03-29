import React from "react";
import { Grid } from "semantic-ui-react";
import BackButton from "components/routing/BackButton";
import ExploreButtons from "./ExploreButtons";
import DonateButtons from "./DonateButtons";
//import GatherButtons from "./GatherButtons";

const MenuGridRow = ({ disabled, gatherScreen }) => {
  const renderButtons = () => {
    //if (gatherScreen) return <GatherButtons />;
    if (gatherScreen) return null;

    return (
      <>
        <ExploreButtons disabled={disabled} />
        <DonateButtons disabled={disabled} />
      </>
    );
  };

  return (
    <Grid.Row style={{ paddingBottom: "0", marginTop: "10px", paddingTop: "20px" }}>
      <Grid.Column
        width={16}
        style={{
          minHeight: "60px",
          display: "flex",
          justifyContent: "space-around",
          alignContent: "flex-start",
          flexWrap: "wrap",
        }}
      >
        <BackButton />
        {renderButtons()}
      </Grid.Column>
    </Grid.Row>
  );
};

export default MenuGridRow;
