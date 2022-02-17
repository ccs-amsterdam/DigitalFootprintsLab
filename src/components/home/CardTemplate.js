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
        fontSize: "min(max(1vw, 1em),1.2em)",
      }}
      onClick={onClick}
    >
      <Dimmer active={loading === "loading"}>
        <Loader />
      </Dimmer>
      {done ? (
        <Icon
          size="massive"
          name="checkmark"
          style={{
            position: "absolute",
            color: "#57b92d8c",
            top: "20%",
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
