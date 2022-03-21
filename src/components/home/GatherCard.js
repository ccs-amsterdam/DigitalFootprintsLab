import React from "react";
import { List } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import { useSelector } from "react-redux";
import { Trans } from "react-i18next";

/**
 * The template for generating GatherCards.
 * These are the cards in the Gather column on the home page.
 */
const GatherCard = ({ source, subname, produces, icon, onClick, loading }) => {
  const statuses = useSelector((state) => {
    return state.dataStatus.filter((data) => data.source === source);
  });

  let done = true;
  const produced = produces.map((p) => {
    const status = statuses.find((s) => s.name === p);
    if (!status?.date) done = false;
    return status ? status : { name: p, status: "empty" };
  });

  return (
    <CardTemplate
      name={source}
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
            <Trans i18nKey="home.gather.gatherCard.click" components={{ b: "<b/>" }} />
          </p>
        )}
        {produced.map(statusMessage)}
      </List>
    </CardTemplate>
  );
};

const statusMessage = (produced, i) => {
  const name = produced.name.replace("_", " ");
  if (produced.status === "failed") {
    if (produced.date) {
      return (
        <List.Item key={i}>
          <List.Icon name="exclamation circle" color="red" />
          <List.Content>
            <Trans
              i18nKey="home.gather.gatherCard.failedUpdate"
              values={{ name }}
              components={{ b: <b /> }}
            />
          </List.Content>
        </List.Item>
      );
    } else {
      return (
        <List.Item key={i}>
          <List.Icon name="close" color="red" />
          <List.Content>
            <Trans
              i18nKey="home.gather.gatherCard.failedGet"
              values={{ name }}
              components={{ b: <b /> }}
            />
          </List.Content>
        </List.Item>
      );
    }
  }

  if (produced.status === "finished")
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
