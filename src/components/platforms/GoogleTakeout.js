import React, { useState } from "react";

import { Button, Container, Divider, Grid, Header, List, Modal, Segment } from "semantic-ui-react";
import CardTemplate from "./CardTemplate";
import takeoutInstructions from "../../images/takeoutInstructions.gif";
import db from "../../apis/dexie";

import JSZip from "jszip";

const GoogleTakeout = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <CardTemplate name={"Google Takeout"} website={"takeout.google.com"} icon={"google"} />
      }
    >
      <Modal.Header>Order takeout from Google</Modal.Header>
      <Modal.Content>
        <Modal.Description>
          <p>
            Google Takeout is a Google service that let's you request your own data for download.
            This includes your browsing history from <b>Chrome</b> and <b>Youtube</b>. You can
            gather this data with the following steps.
          </p>

          <Grid stackable>
            <Grid.Column width={8}>
              <Container>
                <List as="ul" bulleted>
                  <List.Item as="li">
                    First, open the{" "}
                    <a href="https://takeout.google.com/" target="_blank" rel="noopener noreferrer">
                      Google Takeout
                    </a>{" "}
                    website (the link opens in a new tab or window).
                  </List.Item>
                  <List.Item as="li">
                    Find the list under <b>Create a new export</b>.
                  </List.Item>
                  <List.Item as="li">
                    We just want to select <b>Chrome</b> and <b>Youtube</b>, so first click the{" "}
                    <b>deselect all</b> button.
                  </List.Item>
                  <List.Item as="li">
                    Find <b>Chrome</b> near the top (sorted by alphabet)
                  </List.Item>
                  <List.Item as="li">
                    Find <b>Youtube</b> at the bottom
                  </List.Item>
                  <List.Item as="li">
                    For Youtube we also filter out some content. Click on{" "}
                    <b>All Youtube data included</b>, and make sure to select only <b>History</b>
                  </List.Item>
                  <List.Item as="li">
                    Please also click on <b>Multiple formats</b> (under Youtube), and for{" "}
                    <b>History</b> change <b>HTML</b> to <b>JSON</b>
                  </List.Item>
                  <List.Item as="li">
                    Finally, click <b>Next step</b>. Here you can click <b>Create export</b> (the
                    default settings are good). Google will now prepare your data and give you a
                    download link. If you followed the selection steps, this will only be a few
                    megabytes and take only a few minutes.
                  </List.Item>
                </List>
              </Container>
            </Grid.Column>
            <Grid.Column width={8}>
              <Segment>
                <img width="100%" src={takeoutInstructions} alt="loading..." />
              </Segment>
            </Grid.Column>
          </Grid>
          <Divider />
          <Header>Import data in the Digital Footprints App</Header>
          <p>
            Once you have received the Google Takeout download link, download the file to your
            device, and select the file with the following button
          </p>
          <UploadGoogleTakeout />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

const UploadGoogleTakeout = () => {
  const onChangeHandler = (e) => {
    console.log(e);
    let newZip = new JSZip();
    let fileblob = e.target.files[0];

    newZip.loadAsync(fileblob).then(async function (zipped) {
      console.log(zipped);

      let history = await zipped.file("Takeout/Chrome/BrowserHistory.json").async("text");
      history = JSON.parse(history);
      writeHistory(history["Browser History"]);
    });
  };

  return <input type="file" name="file" onChange={onChangeHandler} accept="application/zip" />;
};

const writeHistory = async (history) => {
  let urls = history.map((url) => {
    url.date = convertTimestamp(url.time_usec);
    return url;
  });
  db.addUrls(urls);
};

const convertTimestamp = (time) => {
  const dateInSeconds = Math.round(time / 1000000) - 11644473600;
  return new Date(dateInSeconds * 1000);
};

export default GoogleTakeout;
