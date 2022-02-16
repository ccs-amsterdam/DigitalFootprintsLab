import React, { useRef, useState } from "react";
import PropTypes from "prop-types";

import { Button, Modal } from "semantic-ui-react";

import db from "apis/db";
import tokenize from "util/tokenize";

import JSZip from "jszip";
import { useDispatch } from "react-redux";
import { updateDataStatus } from "actions";
import StepwiseInstructions from "./StepwiseInstructions";
import { googleTakeoutInstruction } from "./googleTakeoutInstruction.js";

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
      style={{ height: "90vh", maxHeight: "800px" }}
    >
      <Modal.Content style={{ height: "90%", overflow: "auto" }}>
        <Modal.Description>
          <StepwiseInstructions instruction={googleTakeoutInstruction} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <ImportGoogleTakeout setOpen={setOpen} setLoading={setLoading} />
        <Button onClick={() => setOpen(false)}>Cancel</Button>
      </Modal.Actions>
    </Modal>
  );
};

const googleTakeoutBrowsingJSON = (data) => {
  return data;
};

const googleTakeoutSearchJSON = (data) => {
  return data;
};

const googleTakeoutYoutubeJSON = (data) => {
  return data;
};

const googleTakeoutYoutubeHTML = (dom) => {
  return dom;
};

const importRecipes = [
  {
    name: "Browsing",
    script: googleTakeoutBrowsingJSON,
    filenames: ["BrowserHistory.json"],
    zippaths: ["Takeout/Chrome"],
  },
  {
    name: "Search",
    script: googleTakeoutSearchJSON,
    filenames: ["BrowserHistory.json"],
    zippath: ["Takeout/Chrome"],
  },
  {
    name: "Youtube",
    script: googleTakeoutYoutubeJSON,
    filenames: ["watch-history.json"],
    zippath: ["Takeout/Youtube and Youtube Music/history"],
  },
  {
    name: "Youtube",
    script: googleTakeoutYoutubeHTML,
    filenames: ["watch-history.html"],
    zippath: ["Takeout/Youtube and Youtube Music/history"],
  },
];

const importData = (source, updateDataStatus) => {
  const names = importRecipes.reduce((set, ir) => set.add(ir.name), new Set([]));
  for (let name of names) updateDataStatus(name, source, "loading");
};

const ImportGoogleTakeout = ({ setOpen, setLoading }) => {
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
    <>
      <Button primary onClick={() => ref.current.click()}>
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
    </>
  );
};

const parseYoutubeHtml = (string) => {
  const dom = new DOMParser().parseFromString(string, "text/html");
  const nodes = dom.querySelector(".mdl-grid").querySelectorAll(".mdl-grid");

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
