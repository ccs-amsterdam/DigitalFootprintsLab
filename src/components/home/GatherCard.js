import React from "react";
import { List } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";
import { useNavigate } from "react-router-dom";

/**
 * The template for generating GatherCards.
 * These are the cards in the Gather column on the home page.
 */
const GatherCard = ({ name, subname, produces, icon, loading }) => {
  const statuses = useSelector((state) => state.dataStatus);
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
      onClick={onClick}
      loading={loading}
      done={done}
    >
      <List style={{ textAlign: "left", paddingTop: "10px" }}>
        {" "}
        {done ? null : (
          <p>
            <Trans i18nKey="home.gather.gatherCard.click" components={{ b: <b /> }} />
          </p>
        )}
        {produced.map(statusMessage)}
      </List>
    </CardTemplate>
  );
};

const statusMessage = (produced, i) => {
  const name = produced?.source?.replace("_", " ");

  if (!produced?.empty) {
    // removed date for now. Could add it back by having db.getDataStatus return the last date or something
    // const date = produced.date.toISOString().split("T")[0];
    return (
      <List.Item key={i}>
        <List.Icon name="check circle outline" color="green" />
        <List.Content>
          <Trans
            i18nKey="home.gather.gatherCard.success"
            values={{ name }}
            components={{ b: <b /> }}
          />
        </List.Content>
      </List.Item>
    );
  }

  return (
    <List.Item key={i}>
      <List.Icon name="circle outline" />
      <List.Content>
        <Trans i18nKey="home.gather.gatherCard.empty" values={{ name }} components={{ b: <b /> }} />
      </List.Content>
    </List.Item>
  );
};

export default GatherCard;
