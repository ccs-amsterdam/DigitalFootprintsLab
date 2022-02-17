import React, { useEffect, useState } from "react";
import WordcloudSpec from "./WordcloudSpec";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Dimmer, Loader } from "semantic-ui-react";

/**
 * Creates a customized Wordcloud chart. Currently mainly designed for group being a url domain.
 * Can extend to other applications (like youtube channels), but will need to add alternative fallback
 * for getting icons and categories
 */
const Wordcloud = ({ dashData, group, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ table: [] }); // input for vega visualization
  const [deleteIds, setDeleteIds] = useState([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createWordcloudData(dashData, group, inSelection));
    setOutSelection(null);
  }, [dashData, group, inSelection, setOutSelection, setLoading]);

  // Vega signal handler
  const onSelectWord = (signal, word) => {
    if (!word) {
      setOutSelection(null);
    } else {
      filterSelectedDatum(word);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async (word) => {
    let selection = await dashData.searchValues([word], group);
    setOutSelection(selection);
  };

  const signalListeners = {
    selectedWord: onSelectWord,
  };

  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <WordcloudSpec
        data={data}
        signalListeners={signalListeners}
        actions={false}
        renderer={"svg"}
      />
      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </div>
  );
};

const createWordcloudData = (dashData, group, selection, groupInfo) => {
  let groups = dashData.count(group, selection);
  groups = Object.keys(groups).map((word) => ({
    text: word,
    visits: groups[word],
    angle: [-45, 0, 45][~~(Math.random() * 3)],
  }));
  //groups = groups.sort((a, b) => a.count - b.count); // sort from high to low value
  console.log(groups);
  return { table: groups };
};

export default React.memo(Wordcloud);
