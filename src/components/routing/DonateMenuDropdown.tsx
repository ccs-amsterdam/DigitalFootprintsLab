import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import MenuDropdownItem from "./MenuDropdownItem";
import { Dropdown } from "semantic-ui-react";

const ExploreMenuDropdown = ({ disabled = false }) => {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    <Dropdown
      item
      icon={null}
      text={t("routing.buttons.donate")}
      style={{ color: "white", paddingLeft: "0" }}
    >
      <Dropdown.Menu>
        <MenuDropdownItem
          key={"remove"}
          label={t("routing.buttons.remove")}
          path={"/remove"}
          selected={location.pathname === "/remove"}
          icon={"eye slash"}
          disabled={disabled}
        />
        <MenuDropdownItem
          key={"donate"}
          label={t("routing.buttons.donate")}
          path={"/donate"}
          selected={location.pathname === "/donate"}
          icon={"student"}
          disabled={disabled}
        />
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExploreMenuDropdown;
