import React from "react";
import { Icon, Button, Popup, Menu } from "semantic-ui-react";
import { useTranslation } from "react-i18next";

import db from "apis/db";

const DeleteDataButton = ({ style = {} }) => {
  const { t } = useTranslation();

  const button = (
    <Menu.Item
      style={{
        color: "white",
        paddingLeft: "0",
        ...style,
      }}
    >
      <Icon name="trash" />
    </Menu.Item>
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
                  //window.location.href += `/?id=${userId}`;
                  window.location.href += "";
                } else {
                  window.location.reload();
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
