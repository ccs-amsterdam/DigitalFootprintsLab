import React, { useEffect, useState } from "react";
import { Card, Icon } from "semantic-ui-react";
import db from "../../apis/dexie";

const CardTemplate = ({ name, website, icon, onClick }) => {
  const [status, setStatus] = useState({});

  useEffect(() => {
    getStatus(db, name, setStatus);
  }, [name, setStatus]);

  const getDescription = (uploadDate) => {
    if (!uploadDate) return <i>Click here to gather this data</i>;

    return (
      <span>
        <Icon size="large" name="check square" color="green" style={{ float: "left" }} />
        <i>
          Retrieved on <b>{uploadDate}</b>
        </i>
      </span>
    );
  };

  return (
    <Card style={{ cursor: "pointer" }} onClick={onClick}>
      <Card.Content>
        <Icon size="huge" name={icon} style={{ float: "right" }} />
        <Card.Header content={name} />
        <Card.Meta content={website} />

        <Card.Description>{getDescription(status.uploadDate)}</Card.Description>
      </Card.Content>
    </Card>
  );
};

const getStatus = async (db, name, setStatus) => {
  const status = await db.platformStatus(name);
  if (status) setStatus(status);
};

export default CardTemplate;
