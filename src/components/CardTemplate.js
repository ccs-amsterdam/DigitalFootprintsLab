import React from "react";
import { useSelector } from "react-redux";
import { Card, Dimmer, Icon, Loader } from "semantic-ui-react";

export const GatherCard = ({ name, subname, icon, onClick, loading }) => {
  const statusMessage = (loading) => {
    if (loading === "failed")
      return (
        <>
          <Icon name="close" color="red" />
          <i>Something went wrong :(</i>
        </>
      );
    if (loading === "finished")
      return (
        <>
          <Icon name="checkmark" color="green" />
          <i>Data succesfully imported</i>
        </>
      );
    return <i>Click here to gather data</i>;
  };

  return (
    <CardTemplate name={name} subname={subname} icon={icon} onClick={onClick} loading={loading}>
      {statusMessage(loading)}
    </CardTemplate>
  );
};

export const PlatformCard = ({ name, subname, icon, onClick }) => {
  const platformStatus = useSelector((state) =>
    state.platformStatus.find((platform) => platform.name === name)
  );
  if (!platformStatus) return null;
  if (platformStatus.status === "failed" && !platformStatus.date) return null;

  return (
    <CardTemplate
      name={name}
      subname={subname}
      icon={icon}
      onClick={onClick}
      loading={platformStatus.status}
    >
      <i>{lastUpdated(platformStatus.date)}</i>
    </CardTemplate>
  );
};

const CardTemplate = ({ children, name, subname, icon, onClick, loading }) => {
  return (
    <Card
      centered
      style={{
        cursor: "pointer",
        width: "100%",
        marginLeft: "2em",
        marginRight: "2em",
        background: "#ffffff00",
      }}
      onClick={onClick}
    >
      <Dimmer active={loading === "loading"}>
        <Loader />
      </Dimmer>
      <Card.Content style={{ background: "#ffffff" }}>
        <Icon size="huge" name={icon} style={{ float: "right" }} />
        <Card.Header content={name} />
        <Card.Meta content={subname} />

        <Card.Description>{children}</Card.Description>
      </Card.Content>
    </Card>
  );
};

const lastUpdated = (date) => {
  if (!date) return "Data not yet gathered";
  const oldTime = date.toISOString();
  const currentTime = new Date().toISOString();

  // if different day, show day
  if (oldTime.slice(0, 10) !== currentTime.slice(0, 10))
    return `Data gathered on ${oldTime.slice(0, 10)}`;

  // otherwise show time
  return "Data gathered today";
};
