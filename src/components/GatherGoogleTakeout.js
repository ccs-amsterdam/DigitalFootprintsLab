import React, { useRef, useState } from "react";

import { Button, Container, Grid, Header, List, Modal, Segment } from "semantic-ui-react";
import gt1 from "../images/googleTakeout1.gif";
import gt2 from "../images/googleTakeout2.gif";
import db from "../apis/dexie";

import JSZip from "jszip";
import { useDispatch } from "react-redux";
import { updatePlatformStatus } from "../actions";

const GatherGoogleTakeout = ({ children, setLoading }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={children}
    >
      <Modal.Header>Google Takeout</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            As you can imagine, Google has a lot of data about many people, and probably about you
            as well. A lesser known fact is that the data is still yours, and Google is legally
            required to give you access to it. You can obtain this data via{" "}
            <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">
              Google Takeout.
            </a>{" "}
          </p>
          <br />
          {/* <p>
            By importing your takeout data in this tool, you can explore your own digital footprints
            from the <b>Chrome browser</b> and <b>Youtube</b>. You can also create filtered and
            anonymized packages of this data that you can donate for scientific research.
          </p> */}

          <Grid stackable>
            <Grid.Column width={16}>
              <Container>
                <Header>How do I order takeout from Google?</Header>

                <List ordered>
                  <List.Item>
                    First, open the{" "}
                    <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">
                      Google Takeout
                    </a>{" "}
                    website (the link opens in a new tab or window).
                  </List.Item>
                  <List.Item>
                    Find the list under <b>Create a new export</b>. Unselect everything, and then
                    only select <b>Chrome</b> and <b>Youtube</b>
                  </List.Item>

                  <List.Item>
                    For Youtube we also filter out some content. Click on{" "}
                    <b>All Youtube data included</b>, and make sure to select only <b>History</b>.
                    Then click on <b>Multiple formats</b> and for <b>History</b> change <b>HTML</b>{" "}
                    to <b>JSON</b>
                  </List.Item>
                  <Grid stackable style={{ marginTop: "1em", marginBottom: "1em" }}>
                    <Grid.Column width={8}>
                      <Header textAlign="center">Step 2</Header>
                      <Segment style={{ padding: 0 }}>
                        <img width="100%" src={gt1} alt="loading..." />
                      </Segment>
                    </Grid.Column>
                    <Grid.Column width={8}>
                      <Header textAlign="center">Step 3</Header>
                      <Segment style={{ padding: 0 }}>
                        <img width="100%" src={gt2} alt="loading..." />
                      </Segment>
                    </Grid.Column>
                  </Grid>
                  <List.Item>
                    Finally, click <b>Next step</b>. Here you can click <b>Create export</b> (the
                    default settings are good). If you followed the selection steps, this will only
                    be a few megabytes, and Google will send you the download link in a few minutes.
                    This link will give you a <b>zip</b> file, that you can upload here:
                  </List.Item>
                </List>
                <br />
                <UploadGoogleTakeout setOpen={setOpen} setLoading={setLoading} />
              </Container>
            </Grid.Column>
          </Grid>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

const UploadGoogleTakeout = ({ setOpen, setLoading }) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const onChangeHandler = async (e) => {
    dispatch(updatePlatformStatus("Chrome", "loading"));
    dispatch(updatePlatformStatus("Youtube", "loading"));

    try {
      setLoading("loading");
      setOpen(false);
      let newZip = new JSZip();
      let fileblob = e.target.files[0];

      const zipped = await newZip.loadAsync(fileblob);

      let chrome = await zipped.file("Takeout/Chrome/BrowserHistory.json").async("text");
      chrome = JSON.parse(chrome);

      writeChromeHistory(chrome["Browser History"]);
      setLoading("finished");
    } catch (e) {
      dispatch(updatePlatformStatus("Chrome", "failed"));
      dispatch(updatePlatformStatus("Youtube", "failed"));
      setLoading("failed");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button floated="center" primary onClick={() => ref.current.click()}>
        Import Google Takeout
      </Button>
      <input
        ref={ref}
        type="file"
        name="file"
        hidden
        onChange={onChangeHandler}
        accept="application/zip"
      />
    </div>
  );
};

const writeChromeHistory = async (history) => {
  let d = history.map((item) => {
    return {
      url: item.url,
      title: item.title,
      date: convertTimestamp(item.time_usec),
      page_transition: item.page_transition,
    };
  });
  await db.addBrowsingHistory(d, "Chrome");
  await db.updatePlatform("Chrome", "finished");
};

const convertTimestamp = (time) => {
  // seems to be in microseconds since epoch
  return new Date(Math.round(time / 1000));
};

export default GatherGoogleTakeout;
