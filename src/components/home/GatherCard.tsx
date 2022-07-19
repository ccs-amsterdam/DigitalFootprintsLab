import React from "react";
import { List, SemanticICONS } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { t } from "i18next";

/**
 * The template for generating GatherCards.
 * These are the cards in the Gather column on the home page.
 */
interface GatherCardProps {
  name: string;
  subname: string;
  produces: string[];
  icon: SemanticICONS;
  img: string;
  loading?: boolean;
}

const GatherCard = ({ name, subname, produces, icon, img, loading = false }: GatherCardProps) => {
  const statuses = useSelector((state: any) => state.dataStatus);
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/gather/" + name.replace(" ", "_"));
  };

  let done = true;
  const produced = produces.map((p) => {
    const status = statuses.find((s) => s.source === p);
    if (!status) done = false;
    return status ? status : { source: p, empty: true };
  });

  return (
    <CardTemplate
      name={name}
      subname={subname}
      icon={icon}
      img={img}
      onClick={onClick}
      loading={loading}
      done={done}
    >
      <List style={{ textAlign: "left", paddingTop: "10px" }}>
        {" "}
        {done ? null : (
          <p>
            <b>{t("home.gather.gatherCard.click")}</b>
          </p>
        )}
        {produced.map(statusMessage)}
      </List>
    </CardTemplate>
  );
};

const statusMessage = (produced, i) => {
  const name = produced?.source?.replace("_", " ");

  const empty = produced?.empty;
  return (
    <List.Item key={i}>
      <List.Icon
        name={empty ? "circle outline" : "check circle outline"}
        style={{ color: empty ? "black" : "green" }}
      />
      <List.Content>{name}</List.Content>
    </List.Item>
  );
};

export default GatherCard;
