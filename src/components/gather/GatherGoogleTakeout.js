import React, { useState, useEffect } from "react";

import { Header, List, Modal } from "semantic-ui-react";

import db from "apis/db";
import tokenize from "util/tokenize";

import { useDispatch } from "react-redux";
import { updateDataStatus } from "actions";
import StepwiseInstructions from "./StepwiseInstructions";
import { googleTakeoutInstruction } from "./googleTakeoutInstruction.js";

import { DropZone, miseEnPlace } from "data-donation-importers";
import cookbook from "./googleTakeoutCookbook";

/**
 * The modal that opens when the Google_Takeout Gather card is clicked.
 */
const GatherGoogleTakeout = ({ children, setLoading }) => {
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);
  const [files, setFiles] = useState([]);

  useEffect(() => {
    if (files.length === 0) return;
    setLoading("loading");
    setOpen(false);
    importGT(files, dispatch).finally(() => setLoading("idle"));
  }, [files, setLoading, dispatch]);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={children}
      style={{ overflow: "auto" }}
      closeIcon
    >
      <Modal.Content style={{ minHeight: "700px" }}>
        <Modal.Description>
          <StepwiseInstructions instruction={googleTakeoutInstruction} />
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions style={{ textAlign: "center" }}>
        <Header as="h2">Final step</Header>

        <List>
          <List.Item>
            Open your <b>downloads folder</b>
          </List.Item>
          <List.Item>
            Find the <b>Google Takeout folder or zip file</b>
          </List.Item>
          <List.Item>
            <b>Click and hold</b> the folder/file, and <b>drag</b> it into the blue field below
          </List.Item>
        </List>

        <DropZone allowedFiles={cookbook.files} setAcceptedFiles={setFiles} />
      </Modal.Actions>
    </Modal>
  );
};

const importGT = async (files, dispatch) => {
  const meps = miseEnPlace(cookbook, files);
  const status = { Search: "failed", Browsing: "failed", Youtube: "failed" };

  for (let name of Object.keys(status))
    dispatch(updateDataStatus(name, "Google_Takeout", "loading"));

  for (let mep of meps) {
    const result = await mep.cook(); // returns array of objects with data, or null if can't find
    if (result.status !== "success") continue;

    if (mep.recipe.name === "browsing") {
      const [browsing, search] = prepareBrowsingHistory(result.data);
      if (browsing.length > 0)
        await db.addData(browsing, "Browsing", "Google_Takeout", ["url", "date"]);
      if (search.length > 0)
        await db.addData(search, "Search", "Google_Takeout", ["query", "date"]);
      status.Search = "finished";
      status.Browsing = "finished";
    }

    if (mep.recipe.name === "youtube") {
      if (result.data.length > 0)
        await db.addData(result.data, "Youtube", "Google_Takeout", ["url", "date"]);
      status.Youtube = "finished";
    }
  }
  for (let name of Object.keys(status))
    dispatch(updateDataStatus(name, "Google_Takeout", status[name]));
};

const prepareBrowsingHistory = (data) => {
  const browsing = [];
  const search = [];

  for (let item of data) {
    let url;
    try {
      url = new URL(item.url);
    } catch (e) {
      console.log("could not parse url");
      continue;
    }
    if (url.hostname + url.pathname === "www.google.com/search") {
      const query = item.title.replace("- Google Search", "").trim();
      let words = tokenize(query);
      search.push({
        query: query,
        word: words,
        date: item.date,
        browser: "Chrome",
      });
      continue;
    }

    let domain = url.hostname;
    domain = domain.replace(/www[0-9]*\./, "");
    domain = domain.replace(/^m\./, "");

    browsing.push({
      url: item.url,
      title: item.title,
      domain,
      browser: "Chrome",
      date: item.date,
      page_transition: item.page_transition,
    });
  }
  return [browsing, search];
};

export default GatherGoogleTakeout;
