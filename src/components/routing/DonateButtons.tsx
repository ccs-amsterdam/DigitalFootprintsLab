import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { useTranslation } from "react-i18next";
import MenuButton from "./MenuButton";

const DonateButtons = ({ disabled }) => {
  const location = useLocation();
  const { t } = useTranslation();

  const selectedRemove = "/remove" === location.pathname;
  const selectedDonate = "/donate" === location.pathname;

  return (
    <div style={{ display: "flex" }}>
      {/* <Icon
        name="student"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      /> */}
      <Button.Group style={{ marginLeft: "12px" }}>
        <MenuButton
          label={t("routing.buttons.remove")}
          path="/remove"
          selected={selectedRemove}
          icon="eye slash"
          disabled={disabled}
        />
        <MenuButton
          label={t("routing.buttons.donate")}
          path="/donate"
          selected={selectedDonate}
          icon="flag checkered"
          disabled={disabled}
        />
      </Button.Group>
    </div>
  );
};

export default DonateButtons;
