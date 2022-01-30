import React, { useEffect, useState } from "react";
import CirclePackSpec from "./CirclePackSpec";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Dimmer, Loader, Card, Image, Button } from "semantic-ui-react";
import useGroupInfo from "components/explore/dashboardData/useGroupInfo";

/**
 * Creates a customized circlepack chart. Currently mainly designed for group being a url domain.
 * Can extend to other applications (like youtube channels), but will need to add alternative fallback
 * for getting icons and categories
 */
const CirclePack = ({ dashData, group, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  const [selectedDatum, setSelectedDatum] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);

  const groupInfo = useGroupInfo(dashData, group);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createTreeData(dashData, group, inSelection, groupInfo));
    setOutSelection(null);
  }, [dashData, group, groupInfo, inSelection, setOutSelection, setLoading]);

  // Vega signal handler
  const onSelectDatum = (signal, datum) => {
    console.log(datum);
    if (!datum) {
      setOutSelection(null);
      setSelectedDatum(null);
    } else {
      filterSelectedDatum(datum);
      setSelectedDatum(datum);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async (selectedDatum) => {
    let selection = await dashData.searchValues([selectedDatum.name], group);
    setOutSelection(selection);
    //setSelectedDatum(null);
  };

  // Popup button handler
  const deleteSelectedDatum = async () => {
    let selection = await dashData.searchValues([selectedDatum.name], group);
    console.log(selection);
    setDeleteIds(selection);
    setSelectedDatum(null);
  };

  const onSelectCategory = (s, d) => console.log(d);

  const signalListeners = {
    selectedDatum: onSelectDatum,
    selectedCategory: onSelectCategory,
  };

  const popupStyle = {
    zIndex: 1,
    position: "absolute",
    left: selectedDatum ? selectedDatum.x : 0,
    top: selectedDatum ? selectedDatum.y : 0,
  };

  console.log(data);
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
      {selectedDatum && (
        <div style={popupStyle}>
          <Card>
            <Card.Content>
              {selectedDatum.icon && <Image floated="left" size="mini" src={selectedDatum.icon} />}
              <Button
                basic
                floated="right"
                size="mini"
                icon="close"
                onClick={() => setSelectedDatum(null)}
              />
              <Card.Header>{selectedDatum.name}</Card.Header>
              <Card.Meta>{`${selectedDatum.visits} visits`}</Card.Meta>
              <Card.Description>
                <p>{selectedDatum.title && selectedDatum.title}</p>
                <p>Category: {selectedDatum.category ? selectedDatum.category : "unknown"}</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                {/* <Button basic color="blue" onClick={filterSelectedDatum}>
                  Select
                </Button> */}
                <Button basic color="red" onClick={deleteSelectedDatum}>
                  Delete
                </Button>
              </div>
            </Card.Content>
          </Card>
        </div>
      )}
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
