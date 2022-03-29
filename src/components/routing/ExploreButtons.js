import React from "react";
import { useLocation } from "react-router-dom";
import { Button } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MenuButton from "./MenuButton";

const ExploreButtons = ({ disabled }) => {
  const statuses = useSelector((state) => {
    const uniqueStatuses = {};
    for (let s of state.dataStatus) uniqueStatuses[s.name] = s;
    return Object.values(uniqueStatuses);
  });
  const location = useLocation();
  const { t } = useTranslation();

  const getLabelAndIcon = (name) => {
    switch (name) {
      case "Browsing":
        return [t("dataTypes.browsing.label"), "history"];
      case "Search":
        return [t("dataTypes.search.label"), "search"];
      case "Youtube":
        return [t("dataTypes.youtube.label"), "youtube"];
      default:
        return ["", null];
    }
  };

  // make this a mini menu: home, explore dropdown, donate dropdown

  if (!statuses || statuses.length === 0) return null;
  return (
    <div style={{ display: "flex" }}>
      {/* <Icon
        name="search"
        size="large"
        style={{ marginLeft: "20px", marginTop: "35px", color: "white" }}
      /> */}
      <Button.Group style={{ marginLeft: "12px" }}>
        {statuses.map((status) => {
          const [label, icon] = getLabelAndIcon(status.name);
          const path = "/" + status.name;
          const selected = path === location.pathname;
          return (
            <MenuButton
              key={label}
              label={label}
              path={"/" + status.name}
              selected={selected}
              icon={icon}
              disabled={disabled}
            />
          );
        })}
      </Button.Group>
    </div>
  );
};

export default ExploreButtons;
