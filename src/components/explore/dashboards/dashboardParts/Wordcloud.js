import React, { useEffect, useState, useRef } from "react";
import VegaWordcloud from "./VegaWordcloud";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Dimmer, Loader } from "semantic-ui-react";

/**
 * Creates a customized Wordcloud chart. Currently mainly designed for group being a url domain.
 * Can extend to other applications (like youtube channels), but will need to add alternative fallback
 * for getting icons and categories
 */
const Wordcloud = ({ dashData, group, inSelection, setOutSelection, colors, unclickable }) => {
  const [data, setData] = useState({ table: [] }); // input for vega visualization
  const [deleteIds, setDeleteIds] = useState([]);
  const box = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createWordcloudData(dashData, group, inSelection));
    if (setOutSelection) setOutSelection(null);
  }, [dashData, group, inSelection, setOutSelection, setLoading]);

  // Vega signal handler
  const onSelectWord = (signal, word) => {
    if (!word) {
      if (setOutSelection) setOutSelection(null);
    } else {
      filterSelectedDatum(word);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async (word) => {
    let selection = await dashData.searchValues([word], group);
    if (setOutSelection) setOutSelection(selection);
  };

  const signalListeners = {
    selectedWord: onSelectWord,
  };

  return (
    <div
      ref={box}
      style={{ position: "relative", width: "100%", height: "100%", paddingTop: "20px" }}
    >
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>

      <VegaWordcloud
        data={data}
        signalListeners={signalListeners}
        colors={colors}
        unclickable={unclickable}
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

  return { table: groups };
};

export default React.memo(Wordcloud);
