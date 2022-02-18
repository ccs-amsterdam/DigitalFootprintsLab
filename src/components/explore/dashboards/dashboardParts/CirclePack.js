import React, { useEffect, useState } from "react";
import CirclePackSpec from "./CirclePackSpec";
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

  const groupInfo = useGroupInfo(dashData, group, grouptype);
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
    let selection = await dashData.searchValues(selectedDatum.values, group);
    setOutSelection(selection);
  };

  const onSelectCategory = (s, d) => console.log(d);

  const signalListeners = {
    selectedDatum: onSelectDatum,
    selectedCategory: onSelectCategory,
  };

  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <CirclePackSpec
        data={data}
        signalListeners={signalListeners}
        actions={false}
        renderer={"svg"}
      />
      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </div>
  );
};

const createTreeData = (dashData, group, selection, groupInfo) => {
  let groups = dashData.count(group, selection);
  groups = Object.keys(groups).map((name) => ({ name, count: groups[name] }));
  groups.sort((a, b) => b.count - a.count); // sort from high to low value

  let nodes = {};
  let categories = {};

  const root = { label: "root", type: "root", id: 0, size: 0 };
  let id = 1; // root gets id = 0

  for (let group of groups) {
    root.size += group.count;
    const category = groupInfo[group.name]?.category;
    const icon = groupInfo[group.name]?.icon;

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

    // for the visualization we'll ignore www and the mobile versions m.
    let label = group.name.replace(/www[0-9]*\./, "");
    label = label.replace(/^m\./, "");

    // cant get rid of cors errors
    //const image = new Image();
    //image.src = icon;
    //image.crossOrigin = "Anonymous";

    if (!nodes[label]) {
      nodes[label] = {
        label,
        type: "group",
        values: [],
        parent: categories[category].id,
        size: 0,
        visits: 0,
        category,
        icon,
      };
    }
    const node = nodes[label];
    node.size += group.count;
    node.visits += group.count;
    node.values.push(group.name);
  }

  // also add category size, because needed to resize within vega (somehow can't efficiently refer to parent in tree in a vega signal)
  nodes = Object.keys(nodes).map((key, i) => {
    const node = nodes[key];
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
