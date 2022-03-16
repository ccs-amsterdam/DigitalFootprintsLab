import React from "react";
import { Icon, Button, Popup } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import db from "apis/db";

const DeleteDataButton = () => {
  const { t } = useTranslation();

  const button = (
    <Button
      style={{
        float: "right",
        background: "#00000000",
        margin: "10px",
        color: "white",
        border: "1px solid white",
      }}
    >
      <Icon name="trash" />
      Delete all data
    </Button>
  );

  return (
    <Popup on="click" trigger={button}>
      <Popup.Header>{t("home.deleteButton.header")}</Popup.Header>
      <Popup.Content>
        <p>{t("home.deleteButton.content1")}</p>
        <p>{t("home.deleteButton.content2")}</p>
      </Popup.Content>
      <br />
      <Button
        negative
        fluid
        onClick={() =>
          db.destroyEverything().then((userId) => {
            if (userId !== "test_user") {
              window.location.href += `/?id=${userId}`;
            } else {
              window.location.reload(`/`);
            }
          })
        }
      >
        Delete data
      </Button>
    </Popup>
  );
};

export default DeleteDataButton;
