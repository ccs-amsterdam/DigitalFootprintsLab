import React from "react";
import { Icon, Button, Popup } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import db from "apis/db";

const DeleteDataButton = () => {
  const { t } = useTranslation();

  const button = (
    <Button
      style={{
        background: "#00000000",
        marginTop: "9px",
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
        <br />
        <Button.Group fluid>
          <Button
            negative
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
            {t("home.deleteButton.buttonLabel")}
          </Button>
        </Button.Group>
      </Popup.Content>
    </Popup>
  );
};

export default DeleteDataButton;
