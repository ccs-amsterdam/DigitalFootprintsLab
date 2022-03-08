import React from "react";
import { Menu, Sidebar } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";

const HeaderMenu = ({ items, children }) => {
  // This header menu is super sneaky.
  // It's actually not meant to be seen.
  // But it's nice to be able to turn it on when developing
  const showHeader = false;

  const location = useLocation();

  const menuItems = items.map((item, index) => {
    return (
      <Menu.Item
        key={"item-" + index}
        index={index}
        as={Link}
        to={item.path}
        header={index === 0}
        disabled={false}
        active={item.path === location.pathname}
      >
        {item.label}
      </Menu.Item>
    );
  });

  return (
    <Sidebar.Pushable>
      <Sidebar
        as={Menu}
        inverted
        animation="push"
        visible={showHeader}
        direction={"top"}
        size="mini"
      >
        {menuItems}
      </Sidebar>
      <Sidebar.Pusher>{children}</Sidebar.Pusher>
    </Sidebar.Pushable>
  );
};

export default HeaderMenu;
