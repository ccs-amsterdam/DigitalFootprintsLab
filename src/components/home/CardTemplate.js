import React from "react";
import { Card, Dimmer, Icon, Loader } from "semantic-ui-react";

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

export default CardTemplate;
