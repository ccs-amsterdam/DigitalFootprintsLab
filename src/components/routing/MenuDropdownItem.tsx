import { useNavigate } from "react-router-dom";
import { Dropdown, Icon, SemanticICONS } from "semantic-ui-react";

interface MenuDropdownItemProps {
  label: string;
  path: string;
  icon?: SemanticICONS;
  img?: string;
  disabled?: boolean;
  selected?: boolean;
}

const MenuDropdownItem = ({
  label,
  path,
  icon,
  img,
  selected = false,
  disabled = false,
}: MenuDropdownItemProps) => {
  const navigate = useNavigate();

  return (
    <Dropdown.Item
      disabled={disabled}
      style={{
        background: selected ? "white" : "#ffffff10",
        color: selected ? "#3b3a3a" : "white",
        marginTop: "10px",
        marginBottom: "10px",
        border: "1px solid #ffffff80",
        height: "40px",
        fontSize: "min(max(1.2vw, 12px), 18px)",
        paddingTop: "10px",
        paddingLeft: "max(1vw, 5px)",
        paddingRight: "max(1vw, 5px)",
        overflow: "visible",
        zIndex: 90,

        //boxShadow: "2px 1px #ffffff2b",
      }}
      onClick={() => navigate(path)}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <div>
          {icon ? (
            <Icon
              name={icon}
              style={{ marginRight: "0.5rem", fontSize: "1.4rem", color: "#4183c4" }}
            />
          ) : img ? (
            <img src={img} alt={"logo"} style={{ width: "28px", paddingRight: "10px" }} />
          ) : null}
        </div>
        <div>{label}</div>
      </div>
    </Dropdown.Item>
  );
};

export default MenuDropdownItem;
