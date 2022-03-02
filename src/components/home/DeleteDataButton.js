import React from "react";
import { Icon, Button, Popup } from "semantic-ui-react";

import db from "apis/db";

const DeleteDataButton = () => {
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
      <Popup.Header>Delete data from browser</Popup.Header>
      <Popup.Content>
        <p>Do you want to delete all the gathered data from the browser?</p>
        <p>
          Note that any data you downloaded will still be on your computer, so you might want to
          delete that as well.
        </p>
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
