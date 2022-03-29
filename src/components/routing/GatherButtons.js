import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { gatherSettings } from "project/gatherSettings";
import MenuButton from "./MenuButton";

const GatherButtons = () => {
  const location = useLocation();

  return (
    <div style={{ display: "flex" }}>
      {/* <Icon
        name="cloud download"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      /> */}
      <Button.Group style={{ marginLeft: "12px" }}>
        {gatherSettings.map((platform) => {
          const pathname = platform.name.replace(" ", "_");
          const path = "/gather/" + pathname;
          const selected = path === location.pathname;
          return (
            <MenuButton
              label={platform.name}
              path={"/gather/" + pathname}
              selected={selected}
              icon={platform.icon}
            />
          );
        })}
      </Button.Group>
    </div>
  );
};

export default GatherButtons;
