import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button, Icon } from "semantic-ui-react";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

const ExploreButtons = () => {
  const navigate = useNavigate();
  const statuses = useSelector((state) => state.dataStatus);
  const location = useLocation();
  const { t } = useTranslation();

  const getLabelAndIcon = (name) => {
    switch (name) {
      case "Browsing":
        return ["dataTypes.browsing.label", "history"];
      case "Search":
        return ["dataTypes.search.label", "search"];
      case "Youtube":
        return ["dataTypes.youtube.label", "youtube"];
      default:
        return ["", null];
    }
  };

  // make this a mini menu: home, explore dropdown, donate dropdown

  if (!statuses || statuses.length === 0) return null;
  return (
    <div style={{ display: "flex" }}>
      <Icon
        name="search"
        size="big"
        style={{ marginLeft: "20px", marginTop: "30px", color: "white" }}
      />
      <Button.Group style={{ marginLeft: "12px" }}>
        {statuses.map((status) => {
          const [label, icon] = getLabelAndIcon(status.name);
          const path = "/" + status.name;
          const selected = path === location.pathname;
          return (
            <Button
              size="large"
              active={path === location.pathname}
              style={{
                background: selected ? "white" : "#00000000",
                color: selected ? "#3b3a3a" : "white",
                border: "1px solid white",
                marginTop: "20px",
                height: "50px",
              }}
              onClick={() => navigate("/" + status.name)}
            >
              <Icon name={icon} />

              {t(label)}
            </Button>
          );
        })}
      </Button.Group>
    </div>
  );
};

export default ExploreButtons;
