import React from "react";
import { useNavigate } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";

const MenuButton = ({ label, path, icon, selected = false, disabled }) => {
  const navigate = useNavigate();

  return (
    <Button
      size="large"
      disabled={disabled}
      style={{
        background: selected ? "white" : "#ffffff10",
        color: selected ? "#3b3a3a" : "white",
        marginTop: "10px",
        border: "1px solid #ffffff80",
        height: "40px",
        fontSize: "min(max(1.2vw, 12px), 18px)",
        paddingTop: "10px",
        paddingLeft: "max(1vw, 5px)",
        paddingRight: "max(1vw, 5px)",
        //boxShadow: "2px 1px #ffffff2b",
      }}
      onClick={() => navigate(path)}
    >
      {icon ? <Icon name={icon} /> : null}

      {label}
    </Button>
  );
};

export default MenuButton;
