import React, { useState } from "react";
import { Button, Modal, Icon } from "semantic-ui-react";

const Navi = () => {
  const [open, setOpen] = useState();

  return (
    <Modal
      open={open}
      basic
      centered={false}
      onClose={() => setOpen(false)}
      position="bottom right"
      trigger={
        <Button
          style={{
            marginLeft: "calc(50vw - 82px)",
            marginTop: "9px",
            padding: "10px 70px",
            color: "white",
            boxShadow: "0 0 40px white",
            background: "#ffffff99",
          }}
          onClick={() => setOpen(!open)}
          icon="question"
          size="huge"
        />
      }
    >
      <Modal.Header style={{ fontSize: "2.5em" }}>Get started by gathering some data</Modal.Header>
      <Modal.Content style={{ fontSize: "1.5em" }}>
        <p>
          The first step is to click on a card in the <b>Gather</b> column on the left. This will
          walk you through the steps for gathering this data and loading it into this application.
        </p>
        <p>
          At this point, <b>the data will only be stored on your own device</b>. You can then first
          use this application to explore your data, and you can also choose to exlude data that you
          do not want to donate.
        </p>
      </Modal.Content>
      <Modal.Actions>
        <Button size="large" basic color="green" inverted onClick={() => setOpen(false)}>
          <Icon name="checkmark" /> Ok, got it!
        </Button>
      </Modal.Actions>
    </Modal>
  );
};

export default Navi;
