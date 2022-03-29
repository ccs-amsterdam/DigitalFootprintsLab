import React from "react";
import { useTranslation } from "react-i18next";
import MenuButton from "./MenuButton";

const BackButton = () => {
  const { t } = useTranslation();
  // make this a mini menu: home, explore dropdown, donate dropdown

  return (
    <div style={{ display: "flex" }}>
      {/* <Icon
        name="home"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      /> */}
      <MenuButton label={t("routing.buttons.back")} icon="home" path="/datasquare" />
    </div>
  );
};

export default BackButton;
