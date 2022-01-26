import React, { useEffect, useState } from "react";
import { PropTypes } from "prop-types";
import BubbleChartSpec from "./BubbleChartSpec";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useDatabaseEntries } from "../../dashboardData/DatabaseEntries";
import { Card, Button, Image, Dimmer, Loader } from "semantic-ui-react";

const propTypes = {
  /** The name of the table in db */
  table: PropTypes.string,
  /** The name of the field in db */
  field: PropTypes.string,
  /** An array with a selection of row ids in table */
  inSelection: PropTypes.array,
  /** An integer specifying the number of words in the cloud*/
  nWords: PropTypes.number,
  /** A boolean for whether data is loading */
  loading: PropTypes.bool,
  /** A callback for setting the selection state */
  setOutSelection: PropTypes.func,
};

/**
 * Makes a wordcloud for keys, for a given table:field in db
 */
const BubbleChart = ({ table, field, inSelection, nWords, loading, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  //  const [loadingData, setLoadingData] = useState(false);
  const [selectedDatum, setSelectedDatum] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, ask: true, itemIds: [] });
  const [filteredDatum, setFilteredDatum] = useState(null);
  const [loadingData, keyTotalObj] = useDatabaseEntries(table, field);

  // Update selection
  useEffect(() => {
    setOutSelection(filteredDatum === null ? null : filteredDatum.ids);
  }, [filteredDatum, setOutSelection]);

  // Filter keyTotalObj for current selection and zoom level
  useEffect(() => {
    // Filter
    let nodes = Object.values(keyTotalObj);
    if (inSelection !== null) {
      nodes = nodes.filter((obj) => inSelection.includes(obj.id));
    }
    if (filteredDatum === null) {
      nodes = nodes.filter((obj) => obj.type !== "url");
    }

    // Only include used categories
    const categories = [...new Set(Object.values(nodes).map((node) => node.category))];
    const cats = [];
    for (let category of categories) {
      cats.push({
        type: "category",
        name: category,
        count: 1,
        parent: "root",
      });
    }

    let keyTotal = [{ type: "root", name: "root" }, ...cats, ...nodes];

    setData({ tree: keyTotal });
  }, [keyTotalObj, inSelection, filteredDatum]); //no, we don't want filteredDatum as dependency

  // Vega signal handler
  const onSelectedDatum = (signal, datum) => {
    if (datum === null) {
      // Clicking outside circles will reset filter
      setFilteredDatum(null);
      setSelectedDatum(null);
    } else {
      if (datum.type === "domain" || datum.type === "url") {
        setSelectedDatum(datum);
      }
    }
  };

  // Vega signal handler
  const onFilterDatum = (signal, datum) => {
    setFilteredDatum(datum);
    setSelectedDatum(null);
  };

  // Popup button handler
  const filterSelectedDatum = () => {
    setFilteredDatum(selectedDatum);
    setSelectedDatum(null);
  };

  // Popup button handler
  const deleteSelectedDatum = () => {
    setConfirm({ ...confirm, open: true, itemIds: selectedDatum.ids });
    setSelectedDatum(null);
  };

  const signalListeners = {
    selectedDatum: onSelectedDatum,
    filterDatum: onFilterDatum,
  };

  const popupStyle = {
    zIndex: 1,
    position: "absolute",
    left: selectedDatum ? selectedDatum.x : 0,
    top: selectedDatum ? selectedDatum.y : 0,
  };

  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading || loadingData}>
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
      <ConfirmDeleteModal table={table} confirm={confirm} setConfirm={setConfirm} />
    </div>
  );
};

BubbleChart.propTypes = propTypes;
export default React.memo(BubbleChart);
