import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

const DonateButtons = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const selectedRemove = "/remove" === location.pathname;
  const selectedDonate = "/donate" === location.pathname;

  return (
    <div style={{ display: "flex" }}>
      <Icon
        name="student"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      />
      <Button.Group style={{ marginLeft: "12px" }}>
        <Button
          size="large"
          style={{
            background: selectedRemove ? "white" : "#00000000",
            color: selectedRemove ? "#3b3a3a" : "white",
            border: "1px solid white",
            marginTop: "20px",
            height: "50px",
          }}
          onClick={() => navigate("/remove")}
        >
          <Icon name={"eye slash"} />

          {t("routing.buttons.remove")}
        </Button>
        <Button
          size="large"
          style={{
            background: selectedDonate ? "white" : "#00000000",
            color: selectedDonate ? "#3b3a3a" : "white",
            marginTop: "20px",
            border: "1px solid white",
            height: "50px",
          }}
          onClick={() => navigate("/donate")}
        >
          <Icon name={"flag checkered"} />

          {t("routing.buttons.donate")}
        </Button>
      </Button.Group>
    </div>
  );
};

export default DonateButtons;
