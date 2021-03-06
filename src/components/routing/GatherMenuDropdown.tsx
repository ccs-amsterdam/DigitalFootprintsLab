import React from "react";
import { useLocation } from "react-router-dom";
import { Button, Dropdown } from "semantic-ui-react";
import { gatherSettings } from "project/gatherSettings";
import MenuDropdownItem from "./MenuDropdownItem";
import { useTranslation } from "react-i18next";

const GatherMenuDropdown = () => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Dropdown item text={t("routing.buttons.gather")} style={{ color: "white" }}>
      <Dropdown.Menu>
        {gatherSettings.map((platform) => {
          const pathname = platform.name.replace(" ", "_");
          const path = "/gather/" + pathname;
          const selected = path === location.pathname;
          return (
            <MenuDropdownItem
              label={platform.name}
              path={"/gather/" + pathname}
              selected={selected}
              icon={platform.icon}
              img={platform.img}
            />
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default GatherMenuDropdown;
