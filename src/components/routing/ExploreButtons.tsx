import React from "react";
import { useLocation } from "react-router-dom";
import { Button, SemanticICONS } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
import MenuButton from "./MenuButton";
import { DataStatus } from "../../types";

const ExploreButtons = ({ disabled }) => {
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
      default:
        return ["", null];
    }
  };

  // make this a mini menu: home, explore dropdown, donate dropdown

  if (!statuses || statuses.length === 0) return null;
  return (
    <div style={{ display: "flex" }}>
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
