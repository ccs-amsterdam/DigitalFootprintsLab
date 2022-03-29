import React, { useState } from "react";
import { Button, Modal, Icon, List, Header } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";

const Navi = () => {
  const [openModal, setOpenModal] = useState(false);
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
        <Modal.Header style={{ fontSize: "2.5em" }}>{t("home.navi.header")}</Modal.Header>
        <Modal.Content style={{ fontSize: "1.5em" }}>
          <List>
            <List.Item>
              <Header style={{ color: "white" }}>
                <Trans i18nKey={"home.gather.title"} components={{ b: <b /> }} />
              </Header>
              <Trans i18nKey={"home.navi.step1"} components={{ b: <b /> }} />
            </List.Item>
            <br />
            <List.Item>
              <Header style={{ color: "white" }}>
                <Trans i18nKey={"home.explore.title"} components={{ b: <b /> }} />
              </Header>

              <Trans i18nKey={"home.navi.step2"} components={{ b: <b /> }} />
            </List.Item>
            <br />
            <List.Item>
              <Header style={{ color: "white" }}>
                <Trans i18nKey={"home.donate.title"} components={{ b: <b /> }} />
              </Header>
              <Trans i18nKey={"home.navi.step3"} components={{ b: <b /> }} />
            </List.Item>
          </List>
        </Modal.Content>

        <Modal.Actions>
          <Button size="large" basic color="green" inverted onClick={() => setOpenModal(false)}>
            <Icon name="checkmark" /> {t("home.navi.ok")}
          </Button>
        </Modal.Actions>
      </Modal>
    </>
  );
};

export default Navi;
