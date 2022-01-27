import React, { useEffect, useState } from "react";
import BubbleChartSpec from "./BubbleChartSpec";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Card, Button, Image, Dimmer, Loader } from "semantic-ui-react";
import useDomainInfo from "components/explore/dashboardData/useDomainInfo";
/**
 * Makes a wordcloud for keys, for a given table:field in db
 */
const BubbleChart = ({ dashData, field, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  const [selectedDatum, setSelectedDatum] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);
  const [filteredDatum, setFilteredDatum] = useState(null);

  const domainInfo = useDomainInfo(dashData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createTreeData(dashData, field, inSelection, domainInfo));
  }, [dashData, field, domainInfo, inSelection, setLoading]);

  // Vega signal handler
  const onSelectedDatum = (signal, datum) => {
    if (datum === null) {
      // Clicking outside circles will reset filter
      setFilteredDatum(null);
      setSelectedDatum(null);
    } else {
      if (datum.type === field) {
        setSelectedDatum(datum);
      }
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async () => {
    let selection = await dashData.searchValues([selectedDatum.name], field);
    setOutSelection(selection);
    setSelectedDatum(null);
  };

  // Popup button handler
  const deleteSelectedDatum = async () => {
    let selection = await dashData.searchValues([selectedDatum.name], field);
    console.log(selection);
    setDeleteIds(selection);
    setSelectedDatum(null);
  };

  const signalListeners = {
    selectedDatum: onSelectedDatum,
  };

  const popupStyle = {
    zIndex: 1,
    position: "absolute",
    left: selectedDatum ? selectedDatum.x : 0,
    top: selectedDatum ? selectedDatum.y : 0,
  };

  return null;
  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <BubbleChartSpec data={data} signalListeners={signalListeners} actions={false} />
      {selectedDatum && (
        <div style={popupStyle}>
          <Card>
            <Card.Content>
              {selectedDatum.logo && <Image floated="left" size="mini" src={selectedDatum.logo} />}
              <Button
                basic
                floated="right"
                size="mini"
                icon="close"
                onClick={() => setSelectedDatum(null)}
              />
              <Card.Header>{selectedDatum.name}</Card.Header>
              <Card.Meta>{`${selectedDatum.count} visits`}</Card.Meta>
              <Card.Description>
                <p>{selectedDatum.title && selectedDatum.title}</p>
                <p>Category: {selectedDatum.category ? selectedDatum.category : "unknown"}</p>
              </Card.Description>
            </Card.Content>
            <Card.Content extra>
              <div className="ui two buttons">
                <Button basic color="blue" onClick={filterSelectedDatum}>
                  Select
                </Button>
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

const createTreeData = (dashData, field, selection, domainInfo) => {
  const domains = dashData.count(field, selection);
  const nodes = [];
  let categories = {};
  for (let domain of Object.keys(domains)) {
    const category = domainInfo?.[domain] || domain.slice(0, 2);
    const logo = domainInfo?.[domain]?.logo
      ? domainInfo[domain].logo
      : `http://${domain}/favicon.ico`;

    if (!categories[category])
      categories[category] = {
        type: "category",
        name: category,
        count: 0,
        parent: "root",
        category,
      };
    categories[category].count++;

    nodes.push({
      type: field,
      name: domain,
      parent: category,
      count: domains[domain],
      category,
      logo,
    });
  }

  categories = Object.values(categories);
  return { tree: [{ name: "root", type: "root" }, ...categories, ...nodes] };
};

export default React.memo(BubbleChart);
