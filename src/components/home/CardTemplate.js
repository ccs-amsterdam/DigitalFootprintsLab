import React from "react";
import { Card, Dimmer, Icon, Loader } from "semantic-ui-react";

const CardTemplate = ({ children, name, subname, icon, onClick, loading, done, disabled }) => {
  return (
    <Card
      centered
      style={{
        cursor: disabled ? null : "pointer",
        width: "100%",
        marginLeft: "2em",
        marginRight: "2em",
        position: "relative",
        color: "green",
        background: "#0f0f0f82",
        border: "2px solid grey",
        boxShadow: "8px 10px #0f0f0f82",
        fontSize: "min(max(1vw, 1em),1.2em)",
      }}
      onClick={disabled ? null : onClick}
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
      <Card.Content style={{ background: disabled ? "#ffffffcc" : "#ffffff" }}>
        <Icon size="huge" name={icon} style={{ float: "left", color: "#4183c4" }} />
        <Card.Header content={name.replace("_", " ")} />
        <Card.Meta content={subname} />

        <Card.Description>{children}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default CardTemplate;
