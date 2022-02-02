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
const CirclePack = ({ dashData, group, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  const [deleteIds, setDeleteIds] = useState([]);

  const groupInfo = useGroupInfo(dashData, group);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createTreeData(dashData, group, inSelection, groupInfo));
    //setOutSelection(null);
  }, [dashData, group, groupInfo, inSelection, setOutSelection, setLoading]);

  // Vega signal handler
  const onSelectDatum = (signal, datum) => {
    console.log(datum);
    if (!datum) {
      setOutSelection(null);
    } else {
      filterSelectedDatum(datum);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async (selectedDatum) => {
    let selection = await dashData.searchValues([selectedDatum.name], group);
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

  let nodes = [];
  let categories = {};

  const root = { name: "root", type: "root", id: 0, size: 0 };
  let id = 1; // root gets id = 0

  for (let group of groups) {
    root.size += group.count;
    const category =
      groupInfo?.[group.name]?.category || group.name.split(".").slice(-1)[0] || "other";

    let icon = groupInfo?.[group.name]?.icon
      ? groupInfo[group.name].icon
      : `https://icons.duckduckgo.com/ip3/${group.name}.ico`; // pretty ok fallback

    if (!categories[category])
      categories[category] = {
        id: id++,
        name: category,
        type: "category",
        label: category,
        size: 0,
        parent: 0,
        category,
      };
    categories[category].size += group.count;

    nodes.push({
      type: "group",
      name: group.name,
      label: group.name.replace("www.", ""),
      parent: categories[category].id,
      size: group.count,
      visits: group.count,
      category,
      icon,
    });
  }

  for (let node of nodes) node.id = id++;

  // also add category size, because needed to resize within vega (somehow can't efficiently refer to parent in tree in a vega signal)
  nodes = nodes.map((node, i) => ({
    ...node,
    size: node.size / root.size,
    categorySize: categories[node.category].size / root.size,
  }));
  categories = Object.values(categories).map((cat, i) => ({ ...cat, size: cat.size / root.size }));
  root.size = 1;
  return { tree: [root, ...categories, ...nodes] };
};

export default React.memo(CirclePack);
