import React from "react";
import { Card, Dimmer, Icon, Loader } from "semantic-ui-react";

const CardTemplate = ({ children, name, subname, icon, onClick, loading, done }) => {
  return (
    <Card
      centered
      style={{
        cursor: "pointer",
        width: "100%",
        marginLeft: "2em",
        marginRight: "2em",
        background: "#ffffff00",
        position: "relative",
      }}
      onClick={onClick}
    >
      <Dimmer active={loading === "loading"}>
        <Loader />
      </Dimmer>
      {done ? (
        <Icon
          size="massive"
          name="check circle"
          style={{
            position: "absolute",
            color: "#68c851ad",
            top: "10%",
            left: "60%",
          }}
        />
      ) : null}
      <Card.Content style={{ background: "#ffffff" }}>
        <Icon size="huge" name={icon} style={{ float: "left" }} />
        <Card.Header content={name.replace("_", " ")} />
        <Card.Meta content={subname} />

        <Card.Description>{children}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default CardTemplate;
