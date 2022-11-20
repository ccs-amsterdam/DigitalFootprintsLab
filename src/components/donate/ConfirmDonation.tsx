import db from "apis/db";
import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import {
  Button,
  Checkbox,
  Form,
  Grid,
  Header,
  List,
  Loader,
  Segment,
  Dimmer,
} from "semantic-ui-react";
import useLogger from "util/useLogger";
import submitData from "./submitData";

const ConfirmDonation = ({ settings }) => {
  const { t } = useTranslation();
  useLogger("Donation screen - confirm");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState(null);
  const [fullStatus, setFullStatus] = useState("not started");
  const [backup, setBackup] = useState(null);

  const onClick = async () => {
    setLoading(true);
    const [finished, backup] = await submitData(settings, status, setStatus);
    setFullStatus(finished ? "finished" : "failed");
    setBackup(backup);
    setLoading(false);
  };

  useEffect(() => {
    if (meta !== null) return;
    db.isWelcome()
      .then((welcome) => {
        setMeta(welcome);
      })
      .catch((e) => {
        console.log(e);
      });
  }, [meta]);

  if (meta === null) return null;
  if (fullStatus === "finished")
    return <Finalize t={t} settings={settings} status={status} meta={meta} backup={backup} />;

  return (
    <Segment
      style={{
        background: "white",
        height: "100%",
        color: "black",
        minHeight: "300px",
        overflow: "auto",
      }}
    >
      <Grid centered stackable verticalAlign="middle" style={{ height: "100%" }}>
        <Grid.Row>
          <Grid.Column width={8} stretched>
            <Header as="h2" style={{ textAlign: "center" }}>
              {t("donate.confirm.header")}
            </Header>
            <br />
            <ConsentForm
              settings={settings}
              setConsent={setConsent}
              done={fullStatus === "finished"}
            />
            <br />
            {meta?.userId === "test_user" ? (
              <Header textAlign="center" color="orange">
                {t("donate.confirm.testuser")}
              </Header>
            ) : (
              <br />
            )}
            {/* <span style={{ textAlign: "center" }}>
              {t("donate.confirm.server")} <br />
              <span style={{ color: "#2185d0" }}>{settings?.server?.donationUrl.value}</span>
            </span> */}
            <br />
            <Button
              primary
              disabled={!consent || loading || fullStatus === "finished"}
              onClick={() => {
                setLoading(true);
                onClick();
              }}
            >
              {fullStatus === "failed"
                ? t("donate.confirm.buttonRetry")
                : t("donate.confirm.button")}
            </Button>

            <StatusList t={t} status={status} loading={loading} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

//const consentItems = ["donate.confirm.consent1", "donate.confirm.consent2"];

const ConsentForm = ({ settings, setConsent, done }) => {
  const [consentArray, setConsentArray] = useState([]);

  useEffect(() => {
    if (!settings?.confirmDonation?.checkboxes) return;
    // could not be done directly in useState, but eventually this should be editable
    setConsentArray(new Array(settings?.confirmDonation?.checkboxes.length).fill(false));
  }, [settings]);

  useEffect(() => {
    let allConsent = consentArray.length > 0;
    for (const consent of consentArray) if (!consent) allConsent = false;
    setConsent(allConsent);
  }, [setConsent, consentArray]);

  if (!settings?.confirmDonation?.checkboxes) return null;
  const consentItems = settings.confirmDonation.checkboxes.map((question) => question.trans);

  return (
    <Form>
      {consentItems.map((item, i) => {
        return (
          <ConsentItem
            key={item + i}
            content={item}
            consent={consentArray[i]}
            setConsent={(checked) => {
              consentArray[i] = checked;
              setConsentArray([...consentArray]);
            }}
            done={done}
          />
        );
      })}
    </Form>
  );
};

const ConsentItem = ({ content, consent, setConsent, done }) => {
  return (
    <Form.Field>
      <Checkbox
        disabled={done}
        label={content}
        checked={consent}
        onChange={(e, d) => setConsent(d.checked)}
      />
    </Form.Field>
  );
};

const StatusList = ({ t, status, loading }) => {
  return (
    <List>
      {status.map((file) => {
        return (
          <List.Item key={file.filename} style={{ marginLeft: "10%" }}>
            <List.Icon
              name={file.success ? "check circle outline" : "times circle outline"}
              color={file.success ? "green" : "red"}
            />
            {file.success ? (
              <List.Content>
                <Trans
                  i18nKey="donate.confirm.donated.success"
                  values={{ n: file.n, filename: file.filename }}
                  components={{ b: <b /> }}
                />
              </List.Content>
            ) : (
              <List.Content>
                <Trans
                  i18nKey="donate.confirm.donated.failure"
                  values={{ filename: file.filename }}
                  components={{ b: <b /> }}
                />
              </List.Content>
            )}
          </List.Item>
        );
      })}
      <Segment style={{ border: "0", boxShadow: "none", marginTop: "20px" }}>
        <Dimmer inverted active={loading}>
          <Loader>{t("donate.confirm.loader")}</Loader>
        </Dimmer>
      </Segment>{" "}
    </List>
  );
};

const Finalize = ({ t, settings, status, meta, backup }) => {
  const onDelete = () => {
    db.destroyEverything().then(() => {
      if (meta.returnURL) {
        window.location.href = meta.returnURL;
      } else {
        window.location.reload();
      }
    });
  };

  const returnLink = () => {
    return (
      <Button negative onClick={onDelete}>
        {t("donate.confirm.delete")}
      </Button>
    );

    // if (!meta?.returnURL)
    //   return (
    //     <Button negative onClick={onDelete}>
    //       {t("donate.confirm.delete")}
    //     </Button>
    //   );

    // return (
    //   <>
    //     <Button.Group fluid>
    //       <Button
    //         primary
    //         onClick={() => {
    //           window.location.href = meta.returnURL;
    //         }}
    //       >
    //         {settings?.confirmDonation?.finishButton?.trans}
    //       </Button>
    //       <Button.Or />
    //       <Button negative onClick={onDelete}>
    //         {t("donate.confirm.delete")} + {settings?.confirmDonation?.finishButton?.trans}
    //       </Button>
    //     </Button.Group>
    //   </>
    // );
  };

  return (
    <Segment
      style={{
        background: "white",
        height: "100%",
        color: "black",
        minHeight: "300px",
        overflow: "auto",
      }}
    >
      <Grid centered stackable verticalAlign="middle" style={{ height: "100%" }}>
        <Grid.Row>
          <Grid.Column textAlign="center" width={12}>
            <Header as="h2">{settings?.confirmDonation?.finishHeader?.trans}</Header>
            <div style={{ textAlign: "left", marginLeft: "20%", marginTop: "5%" }}>
              <StatusList t={t} status={status} loading={false} />
            </div>
            <p>{t("donate.confirm.cleanup")}</p>

            <Grid.Row style={{ marginTop: "30px" }}>{returnLink()}</Grid.Row>
          </Grid.Column>
        </Grid.Row>
        {/* <Grid.Row>
          <Grid.Column textAlign="center">
            <DownloadBackup backup={backup} />
          </Grid.Column>
        </Grid.Row> */}
      </Grid>
    </Segment>
  );
};

// const DownloadBackup = ({ backup }) => {
//   const downloadBackup = async () => {
//     const meta = await db.idb.meta.get(1);
//     const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(JSON.stringify(backup))}`;
//     const link = document.createElement("a");
//     link.href = jsonString;
//     link.download = `dfl_${meta.userId}.json`;
//     link.click();
//   };

//   if (!backup) return null;

//   return (
//     <Button
//       style={{ paddingTop: "10px" }}
//       secondary
//       onClick={() => {
//         downloadBackup();
//       }}
//     >
//       {t("donate.confirm.download")}{" "}
//     </Button>
//   );
// };

export default ConfirmDonation;
