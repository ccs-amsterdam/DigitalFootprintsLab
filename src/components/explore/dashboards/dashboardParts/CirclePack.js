import React, { useEffect, useState } from "react";
import VegaCirclePack from "./VegaCirclePack";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Dimmer, Loader } from "semantic-ui-react";
import useGroupInfo from "components/explore/dashboardData/useGroupInfo";

/**
 * Creates a customized circlepack chart. Currently mainly designed for group being a url domain.
 * Can extend to other applications (like youtube channels), but will need to add alternative fallback
 * for getting icons and categories
 */
const CirclePack = ({ dashData, group, grouptype, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  const [deleteIds, setDeleteIds] = useState([]);

  const [groupInfo, groupInfoReady] = useGroupInfo(dashData, group, grouptype);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createTreeData(dashData, group, inSelection, groupInfo));
    //setOutSelection(null);
  }, [dashData, group, groupInfo, inSelection, setOutSelection, setLoading]);

  // Vega signal handler
  const onSelectDatum = (signal, datum) => {
    if (!datum) {
      setOutSelection(null);
    } else {
      filterSelectedDatum(datum);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async (selectedDatum) => {
    let selection = await dashData.searchValues([selectedDatum.label], group);
    setOutSelection(selection);
  };

  const onSelectCategory = (s, d) => console.log(d);

  const signalListeners = {
    selectedDatum: onSelectDatum,
    selectedCategory: onSelectCategory,
  };

  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading || !groupInfoReady}>
        <Loader />
      </Dimmer>
      <VegaCirclePack data={data} signalListeners={signalListeners} />
      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </div>
  );
};

const createTreeData = (dashData, group, selection, groupInfo) => {
  let groups = dashData.count(group, selection);
  groups = Object.keys(groups).map((name) => ({ name, count: groups[name] }));
  groups.sort((a, b) => b.count - a.count); // sort from high to low value

  let nodes = [];
  let categories = {};

  const root = { label: "root", type: "root", id: 0, size: 0 };
  let id = 1; // root gets id = 0

  for (let group of groups) {
    root.size += group.count;
    const category =
      groupInfo[group.name]?.category || group.name.split(".").slice(-1)[0] || "other";
    const icon =
      groupInfo[group.name]?.icon || `https://icons.duckduckgo.com/ip3/${group.name}.ico`;

    if (!categories[category])
      categories[category] = {
        id: id++,
        type: "category",
        label: category,
        size: 0,
        parent: 0,
        category,
      };
    categories[category].size += group.count;

    // cant get rid of cors errors. maybe try again later
    //const image = new Image();
    //image.src = icon;
    //image.crossOrigin = "Anonymous";
    nodes.push({
      label: group.name,
      type: "group",
      parent: categories[category].id,
      size: group.count,
      visits: group.count,
      category,
      icon,
    });
  }

  // also add category size, because needed to resize within vega (somehow can't efficiently refer to parent in tree in a vega signal)
  nodes = nodes.map((node, i) => {
    return {
      ...node,
      id: id++,
      size: node.size / root.size,
      categorySize: categories[node.category].size / root.size,
    };
  });
  categories = Object.values(categories).map((cat, i) => ({ ...cat, size: cat.size / root.size }));
  root.size = 1;
  return { tree: [root, ...categories, ...nodes] };
};

export default React.memo(CirclePack);
