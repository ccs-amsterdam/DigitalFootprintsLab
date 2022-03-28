import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { gatherSettings } from "project/project";

const GatherButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div style={{ display: "flex" }}>
      <Icon
        name="cloud download"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      />
      <Button.Group style={{ marginLeft: "12px" }}>
        {gatherSettings.map((platform) => {
          const pathname = platform.name.replace(" ", "_");
          const path = "/gather/" + pathname;
          const selected = path === location.pathname;
          return (
            <Button
              key={platform.name}
              size="large"
              active={path === location.pathname}
              style={{
                background: selected ? "white" : "#00000000",
                color: selected ? "#3b3a3a" : "white",
                border: "1px solid white",
                marginTop: "20px",
                height: "50px",
              }}
              onClick={() => navigate("/gather/" + pathname)}
            >
              <Icon name={platform.icon} />

              {platform.name}
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default GatherButtons;
