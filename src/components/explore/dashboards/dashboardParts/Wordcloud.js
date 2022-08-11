import React, { useEffect, useState, useRef } from "react";
import VegaWordcloud from "./VegaWordcloud";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Dimmer, Loader } from "semantic-ui-react";
import { SetState } from "types";

/**
 * Creates a customized Wordcloud chart. Currently mainly designed for group being a url domain.
 * Can extend to other applications (like youtube channels), but will need to add alternative fallback
 * for getting icons and categories
 */
interface WordCloudProps {
  dashData: any;
  group: string;
  inSelection: number[];
  outSelection?: { label: string, selection: number[] };
  setOutSelection?: SetState<{ label: string, selection: number[] }>;
  colors?: any;
  unclickable?: boolean;
}

const Wordcloud = ({
  dashData,
  group,
  inSelection,
  outSelection,
  setOutSelection,
  colors,
  unclickable,
}: WordCloudProps) => {
  const [data, setData] = useState({ table: [] }); // input for vega visualization
  const [deleteIds, setDeleteIds] = useState([]);
  const [selectedWord, setSelectedWord] = useState(null);
  const box = useRef();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createWordcloudData(dashData, group, inSelection));
  }, [dashData, group, inSelection, setOutSelection, setLoading]);

  useEffect(() => {
    setSelectedWord((selectedWord) => {
      if (selectedWord !== outSelection?.selected) return outSelection?.selected;
      return selectedWord;
    });
    console.log(outSelection?.selected);
  }, [outSelection]);

  useEffect(() => {
    if (!selectedWord) {
      if (setOutSelection) setOutSelection(null);
    } else {
      const selection = dashData.searchValues([selectedWord], group);
      if (setOutSelection) setOutSelection({ selected: selectedWord, ids: selection });
    }
  }, [dashData, selectedWord]);

  return (
    <div ref={box} style={{ position: "relative", width: "100%", height: "100%" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>

      <VegaWordcloud
        data={data}
        selectedWord={selectedWord}
        setSelectedWord={setSelectedWord}
        colors={colors}
        unclickable={unclickable}
      />
      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </div>
  );
};

const createWordcloudData = (dashData, group, selection) => {
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
