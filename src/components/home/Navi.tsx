import React, { useState } from "react";
import { Button, Modal, Icon, List, Header, Popup, Menu } from "semantic-ui-react";
import { Trans, useTranslation } from "react-i18next";
import useSettings from "util/useSettings";
import transCommon from "util/transCommon";

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
          <Menu.Item
            style={{
              //marginLeft: "calc(50vw - 82px)",
              color: "white",
              paddingLeft: "0",
              //boxShadow: "0 0 40px white",
              //background: "#ffffff40",
            }}
            onClick={() => setOpenModal(!openModal)}
            icon="question"
          />
        }
      >
        <Modal.Header style={{ fontSize: "2em" }}>{t("home.navi.header")}</Modal.Header>
        <Modal.Content style={{ fontSize: "1.3em" }}>
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
            <ContactInfo t={t} />
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

const ContactInfo = ({ t }) => {
  const contact = useSettings("contact");
  if (!contact || Object.keys(contact).length === 0) return null;

  return (
    <>
      <br />
      <List.Item>
        <Header style={{ color: "white" }}>{contact?.title.trans}</Header>
        <p style={{ color: "white" }}>{contact?.message?.trans}</p>
        <ContactEmail t={t} contact={contact} />
        <ContactPhone contact={contact} />
      </List.Item>
    </>
  );
};

const ContactEmail = ({ t, contact }) => {
  const [open, setOpen] = useState(false);
  if (!contact.email) return null;

  return (
    <div style={{ display: "flex" }}>
      <Icon name="mail" style={{ color: "white", marginRight: "10px" }} size="large" />
      <Popup
        wide
        open={open}
        trigger={
          <Header
            style={{ color: "lightblue", cursor: "pointer" }}
            onClick={async () => {
              await navigator.clipboard.writeText(contact.email.trans);
              setOpen(true);
              setTimeout(() => {
                setOpen(false);
              }, 1250);
            }}
          >
            {contact.email.trans}
          </Header>
        }
      >
        {transCommon("copied", t)}!
      </Popup>
    </div>
  );
};

const ContactPhone = ({ contact }) => {
  if (!contact.phone) return null;
  return (
    <Header style={{ color: "lightblue" }}>
      <Icon name="phone" style={{ color: "white" }} />
      {contact.phone.trans}
    </Header>
  );
};

export default Navi;
