import { useLocation } from "react-router-dom";
import { Dropdown, SemanticICONS } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import { DataStatus } from "../../types";
import MenuDropdownItem from "./MenuDropdownItem";

const ExploreMenuDropdown = ({ disabled = false }) => {
  const statuses: DataStatus[] = useSelector((state: any) => {
    const uniqueStatuses = {};
    for (const s of state.dataStatus) uniqueStatuses[s.name] = s;
    return Object.values(uniqueStatuses);
  });
  const location = useLocation();
  const { t } = useTranslation();

  const getLabelAndIcon = (name: string): [string, SemanticICONS] => {
    switch (name) {
      case "Browsing":
        return [t("dataTypes.browsing.label"), "history"];
      case "Search":
        return [t("dataTypes.search.label"), "search"];
      case "Youtube":
        return [t("dataTypes.youtube.label"), "youtube"];
      case "TikTok":
        return [t("dataTypes.tiktok.label"), "database"];
      default:
        return ["", null];
    }
  };

  // make this a mini menu: home, explore dropdown, donate dropdown

  if (!statuses || statuses.length === 0) return null;
  return (
    <Dropdown
      item
      icon={null}
      text={t("routing.buttons.explore")}
      style={{ color: "white", paddingLeft: "0" }}
    >
      <Dropdown.Menu>
        {statuses.map((status) => {
          const [label, icon] = getLabelAndIcon(status.name);
          const path = "/" + status.name;
          const selected = path === location.pathname;
          return (
            <MenuDropdownItem
              key={label}
              label={label}
              path={"/" + status.name}
              selected={selected}
              icon={icon}
              disabled={disabled}
            />
          );
        })}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default ExploreMenuDropdown;
