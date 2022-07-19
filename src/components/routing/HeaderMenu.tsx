import React from "react";
import { Icon, Menu, Sidebar } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import ExploreMenuDropdown from "./ExploreMenuDropdown";
import GatherMenuDropdown from "./GatherMenuDropdown";

const HeaderMenu = ({ items }) => {
  const location = useLocation();

  return (
    <Menu
      style={{
        background: "#00000090",
        borderBottom: "1px solid white",
        zIndex: 10,
        display: "flex",
        flexWrap: "wrap",
      }}
    >
      {/* {items.map((item, index) => {
        return (
          <Menu.Item
            key={"item-" + index}
            index={index}
            as={Link}
            to={item.path}
            header={index === 0}
            disabled={false}
            active={item.path === location.pathname}
            style={{ color: "white" }}
          >
            {item.label}
          </Menu.Item>
        );
      })} */}
      <Menu.Item
        key={"home"}
        as={Link}
        to={"/datasquare"}
        disabled={false}
        active={"/datasquare" === location.pathname}
        style={{ color: "white" }}
      >
        <Icon name="home" />
      </Menu.Item>
      <GatherMenuDropdown />
      <ExploreMenuDropdown />
    </Menu>
  );
};

export default HeaderMenu;
