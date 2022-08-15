import { Icon, Menu } from "semantic-ui-react";
import { Link, useLocation } from "react-router-dom";
import ExploreMenuDropdown from "./ExploreMenuDropdown";
import GatherMenuDropdown from "./GatherMenuDropdown";
import DonateMenuDropdown from "./DonateMenuDropdown";
import ChangeLanguage from "components/home/ChangeLanguage";
import Navi from "components/home/Navi";
import DeleteDataButton from "components/home/DeleteDataButton";

const menuStyle = {
  background: "#000000b0",
  borderBottom: "1px solid white",
  zIndex: 10,
  display: "flex",
  flexWrap: "wrap",
  fontSize: "min(max(2vw, 1em),1.1em)",
  borderRadius: "0",
};

const HeaderMenu = ({ items }) => {
  const location = useLocation();

  if (location.pathname === '/lowlands') return null

  if (location.pathname === "/")
    return (
      <Menu style={menuStyle}>
        <Menu.Menu position="right">
          <ChangeLanguage />
        </Menu.Menu>
      </Menu>
    );

  return (
    <Menu style={menuStyle}>
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
      <DonateMenuDropdown />
      <Menu.Menu position="right">
        <Navi />
        <ChangeLanguage />
        <DeleteDataButton />
      </Menu.Menu>
    </Menu>
  );
};

export default HeaderMenu;
