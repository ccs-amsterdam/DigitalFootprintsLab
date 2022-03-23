import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Button, Modal, Icon } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";

const Navi = () => {
  const [openModal, setOpenModal] = useState(false);
  const statuses = useSelector((state) => state.dataStatus);
  const { t } = useTranslation();

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
        <NaviHeader statuses={statuses} t={t} />
        <NaviContent statuses={statuses} t={t} />

        <Modal.Actions>
          <Button size="large" basic color="green" inverted onClick={() => setOpenModal(false)}>
            <Icon name="checkmark" /> Ok, got it!
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

const NaviHeader = ({ statuses, t }) => {
  if (statuses && statuses.length > 0)
    return (
      <Modal.Header style={{ fontSize: "2.5em" }}>
        {t("home.navi.first.header1", "Now that you have data, you can do two things")}
      </Modal.Header>
    );

  return (
    <Modal.Header style={{ fontSize: "2.5em" }}>
      {t("home.navi.second.header2", "Get started by gathering some data")}
    </Modal.Header>
  );
};

const NaviContent = ({ statuses, t }) => {
  if (statuses && statuses.length > 0)
    return (
      <Modal.Content style={{ fontSize: "1.5em" }}>
        <p>
          <Trans i18nKey={"home.navi.second.content1"} components={{ b: <b /> }} />
        </p>
        <p>
          <Trans i18nKey={"home.navi.second.content2"} components={{ b: <b /> }} />
        </p>
      </Modal.Content>
    );

  return (
    <Modal.Content style={{ fontSize: "1.5em" }}>
      <p>
        <Trans i18nKey={"home.navi.first.content1"} components={{ b: <b /> }} />
      </p>
      <p>
        <Trans i18nKey={"home.navi.first.content2"} components={{ b: <b /> }} />
      </p>
    </Modal.Content>
  );
};

export default Navi;
