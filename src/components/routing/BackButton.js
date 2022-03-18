import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

const BackButton = () => {
  const navigate = useNavigate();
  // make this a mini menu: home, explore dropdown, donate dropdown

  return (
    <div style={{ display: "flex" }}>
      <Icon
        name="home"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      />
      <Button
        size="large"
        style={{
          background: "#00000000",
          color: "white",
          border: "1px solid white",
          marginLeft: "12px",
          marginTop: "20px",
          height: "50px",
        }}
        onClick={() => navigate("/datasquare")}
      >
        Back to overview
      </Button>
    </div>
  );
};

export default BackButton;
