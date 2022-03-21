import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Icon } from "semantic-ui-react";

const Navi = () => {
  const [openModal, setOpenModal] = useState(false);
  const statuses = useSelector((state) => state.dataStatus);

  return (
    <>
      <Modal
        open={openModal}
        basic
        centered={false}
        onClose={() => setOpenModal(false)}
        position="bottom right"
        trigger={
          <Button
            style={{
              //marginLeft: "calc(50vw - 82px)",
              marginTop: "9px",

              color: "white",
              boxShadow: "0 0 40px white",
              background: "#ffffff99",
              border: "1px solid white",
            }}
            onClick={() => setOpenModal(!openModal)}
            icon="question"
          />
        }
      >
        <NaviHeader statuses={statuses} />
        <NaviContent statuses={statuses} />

        <Modal.Actions>
          <Button size="large" basic color="green" inverted onClick={() => setOpenModal(false)}>
            <Icon name="checkmark" /> Ok, got it!
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const NaviHeader = ({ statuses }) => {
  if (statuses && statuses.length > 0)
    return (
      <Modal.Header style={{ fontSize: "2.5em" }}>
        Now that you have data, you can do three things
      </Modal.Header>
    );

  return (
    <Modal.Header style={{ fontSize: "2.5em" }}>Get started by gathering some data</Modal.Header>
  );
};

const NaviContent = ({ statuses }) => {
  if (statuses && statuses.length > 0)
    return (
      <Modal.Content style={{ fontSize: "1.5em" }}>
        <p>
          First, you can <b>explore</b> your data. This step is optional, so if you just want to
          donate your data you can skip it.
        </p>
        <p>
          Second, you can <b>donate</b> you data. If you click the donate card, we will walk you
          through the steps. You can also first click the <b>exclude data</b> card, which lets you
          search and delete items from your data that you don't want to share.
        </p>
        <p>
          Finally, you can update your data or add new data by clicking a card in the Gather column.
        </p>
      </Modal.Content>
    );

  return (
    <Modal.Content style={{ fontSize: "1.5em" }}>
      <p>
        The first step is to click on a card in the <b>Gather</b> column on the left. This will walk
        you through the steps for gathering this data and loading it into this application.
      </p>
      <p>
        At this point, <b>the data will only be stored on your own device</b>. You can then first
        use this application to explore your data, and you can also choose to exlude data that you
        do not want to donate.
      </p>
    </Modal.Content>
  );
};

export default Navi;
