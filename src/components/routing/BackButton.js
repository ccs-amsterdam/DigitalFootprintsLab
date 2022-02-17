import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

const BackButton = () => {
  const navigate = useNavigate();

  return (
    <Button
      style={{
        position: "absolute",
        left: "0",
        background: "#00000000",
        color: "white",
        border: "1px solid white",
        marginLeft: "20px",
        marginTop: "20px",
      }}
      onClick={() => navigate("/datasquare")}
    >
      <Icon name="backward" />
      Go back
    </Button>
  );
};

export default BackButton;
