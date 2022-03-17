import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

const BackButton = () => {
  const navigate = useNavigate();
  // make this a mini menu: home, explore dropdown, donate dropdown

  return (
    <Button
      size="large"
      style={{
        background: "#00000000",
        color: "white",
        border: "1px solid white",
        marginLeft: "20px",
        marginTop: "20px",
        height: "50px",
      }}
      onClick={() => navigate("/datasquare")}
    >
      <Icon name="home" />
      Back to overview
    </Button>
  );
};

export default BackButton;
