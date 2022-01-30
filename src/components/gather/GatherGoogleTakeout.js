import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { Button, Container, Grid, Header, List, Modal, Segment } from "semantic-ui-react";
import gt1 from "images/googleTakeout1.gif";
import gt2 from "images/googleTakeout2.gif";
import db from "apis/db";
import tokenize from "util/tokenize";

import JSZip from "jszip";
import { useDispatch } from "react-redux";
import { updateDataStatus } from "actions";

// This script handles everything related to importing Google_Takeout data
// It should serve as an example for implementing other platforms
// (and could probably do with a makeover)

const propTypes = {
  /** A <GatherCard/>, which then serves as the trigger for the modal when clicked on */
  children: PropTypes.element,
  /** callback function for setting the loading status */
  setLoading: PropTypes.func,
};

/**
 * The modal that opens when the Google_Takeout Gather card is clicked.
 */
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
                <WriteToDB setOpen={setOpen} setLoading={setLoading} />
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

const WriteToDB = ({ setOpen, setLoading }) => {
  const dispatch = useDispatch();
  const ref = useRef();

  const onChangeHandler = async (e) => {
    dispatch(updateDataStatus("Browsing", "Google_Takeout", "loading"));
    dispatch(updateDataStatus("Search", "Google_Takeout", "loading"));
    dispatch(updateDataStatus("Youtube", "Google_Takeout", "loading"));

    let failed = false;

    try {
      setLoading("loading");
      setOpen(false);
      let newZip = new JSZip();
      let fileblob = e.target.files[0];

      const zipped = await newZip.loadAsync(fileblob);

      try {
        let chrome = await zipped.file("Takeout/Chrome/BrowserHistory.json").async("text");
        chrome = JSON.parse(chrome);
        await writeChromeHistory(chrome["Browser History"]);
        dispatch(updateDataStatus("Browsing", "Google_Takeout", "finished"));
        dispatch(updateDataStatus("Search", "Google_Takeout", "finished"));
      } catch (e) {
        failed = true;
        console.log("chrome error");
        console.log(e);
        dispatch(updateDataStatus("Browsing", "Google_Takeout", "failed"));
        dispatch(updateDataStatus("Search", "Google_Takeout", "failed"));
      }

      try {
        let youtube;
        const isJSON = zipped.file("Takeout/YouTube and YouTube Music/history/watch-history.json");
        if (isJSON) {
          youtube = await zipped
            .file("Takeout/YouTube and YouTube Music/history/watch-history.json")
            .async("text");
          youtube = JSON.parse(youtube);
        } else {
          youtube = await zipped
            .file("Takeout/YouTube and YouTube Music/history/watch-history.html")
            .async("text");
          youtube = parseYoutubeHtml(youtube);
        }
        await writeYoutubeHistory(youtube);
        dispatch(updateDataStatus("Youtube", "Google_Takeout", "finished"));
      } catch (e) {
        console.log(e);
        failed = true;
        dispatch(updateDataStatus("Youtube", "Google_Takeout", "failed"));
      }
    } catch (e) {
      setLoading("failed");
    }

    setLoading(failed ? "failed" : "finished");
  };

  return (
    <div style={{ textAlign: "center" }}>
      <Button primary onClick={() => ref.current.click()}>
        Import Google_Takeout
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

const parseYoutubeHtml = (string) => {
  const doc = new DOMParser().parseFromString(string, "text/html");
  const nodes = doc.querySelector(".mdl-grid").querySelectorAll(".mdl-grid");

  const items = [];
  for (let i = 0; i < nodes.length; i++) {
    const node = nodes[i];
    const aList = node.querySelectorAll("a");

    const item = {};
    if (aList.length === 2) {
      item.subtitles = { name: aList[1].textContent, url: aList[1].attributes.href.textContent };
    }
    item.titleUrl = aList[0].attributes.href.textContent;
    item.title = aList[0].textContent;

    const br = node.children[1].querySelectorAll("br");
    const datestring = br[br.length - 1].nextSibling.textContent;
    const date = new Date(Date.parse(datestring.replace("CEST", "GMT+0200")));
    item.time = date.toISOString();
    items.push(item);
  }
  return items;
};

const writeChromeHistory = async (history) => {
  let urls = [];
  let queries = [];

  let url;
  for (let item of history) {
    try {
      url = new URL(item.url);
    } catch (e) {
      console.log("could not parse url");
      continue;
    }
    if (url.hostname + url.pathname === "www.google.com/search") {
      const query = item.title.replace("- Google Search", "").trim();
      let words = tokenize(query);
      queries.push({
        query: query,
        word: words,
        date: convertTimestamp(item.time_usec),
        browser: "Chrome",
      });
      continue;
    }

    urls.push({
      url: item.url,
      title: item.title,
      domain: url.hostname,
      browser: "Chrome",
      date: convertTimestamp(item.time_usec),
      page_transition: item.page_transition,
    });
  }

  await db.addData(queries, "Search", "Google_Takeout", ["url", "date"]);
  await db.addData(urls, "Browsing", "Google_Takeout", ["query", "date"]);
};

const writeYoutubeHistory = async (history) => {
  let d = history.map((item) => {
    return {
      url: item.titleUrl,
      title: item.title,
      date: new Date(item.time),
      channel: item.subtitles ? item.subtitles.name : "channel removed",
      channel_url: item.subtitles ? item.subtitles.url : "channel removed",
    };
  });

  console.log(d);
  await db.addData(d, "Youtube", "Google_Takeout", ["url", "date"]);
};

const convertTimestamp = (time) => {
  // seems to be in microseconds since epoch
  return new Date(Math.round(time / 1000));
};

GatherGoogleTakeout.propTypes = propTypes;
export default GatherGoogleTakeout;
