import { ReactElement } from "react";
import { Card, Dimmer, Icon, Loader, SemanticICONS } from "semantic-ui-react";

interface CardTemplateProps {
  name: string;
  subname: string;
  icon?: SemanticICONS;
  img?: string;
  onClick: () => any;
  children?: ReactElement | ReactElement[];
  loading?: boolean;
  done?: boolean;
  disabled?: boolean;
}

const CardTemplate = ({
  children,
  name,
  subname,
  icon,
  img,
  onClick,
  loading,
  done,
  disabled,
}: CardTemplateProps) => {
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
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      {done ? (
        <Icon
          size="huge"
          name="checkmark"
          style={{
            position: "absolute",
            color: "#57b92d8c",
            bottom: "0%",
            right: "0%",
          }}
        />
      ) : null}
      <Card.Content style={{ background: disabled ? "#ffffffcc" : "#ffffff" }}>
        {icon ? (
          <Icon
            size="huge"
            name={icon}
            style={{ float: "left", width: "66px", height: "55px", color: "#4183c4" }}
          />
        ) : (
          <img src={img} alt={"logo"} style={{ float: "left", width: "66px", height: "55px" }} />
        )}
        <Card.Header content={name.replace("_", " ")} />
        <Card.Meta content={subname} />

        <Card.Description>{children}</Card.Description>
      </Card.Content>
    </Card>
  );
};

export default CardTemplate;
