import React, { useEffect, useState } from "react";
import BubbleChartSpec from "./BubbleChartSpec";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { Card, Button, Image, Dimmer, Loader } from "semantic-ui-react";
import useDomainInfo from "components/explore/dashboardData/useDomainInfo";

/**
 * Makes a wordcloud for keys, for a given table:field in db
 * dashData.data needs to have a 'domain' field
 */
const BubbleChart = ({ dashData, inSelection, setOutSelection }) => {
  const [data, setData] = useState({ tree: [] }); // input for vega visualization
  const [selectedDatum, setSelectedDatum] = useState(null);
  const [deleteIds, setDeleteIds] = useState([]);

  const domainInfo = useDomainInfo(dashData);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(createTreeData(dashData, inSelection, domainInfo));
  }, [dashData, domainInfo, inSelection, setLoading]);

  // Vega signal handler
  const onSelectDatum = (signal, datum) => {
    if (datum === null || datum == null) {
      // Clicking outside circles will reset filter
      setSelectedDatum(null);
      setOutSelection(null);
    } else {
      setSelectedDatum(datum);
    }
  };

  const onSelectedCategory = (signal, category) => {
    console.log(category);
    if (category) {
      const selectedDatums = [];
      for (let d of data.tree)
        if (d.type === "domain" && d.category === category) selectedDatums.push(d.name);
      let selection = dashData.searchValues(selectedDatums, "domain");
      setOutSelection(selection);
    } else {
      setOutSelection(null);
    }
  };

  // Vega signal handler

  // Popup button handler
  const filterSelectedDatum = async () => {
    let selection = await dashData.searchValues([selectedDatum.name], "domain");
    setOutSelection(selection);
    setSelectedDatum(null);
  };

  // Popup button handler
  const deleteSelectedDatum = async () => {
    let selection = await dashData.searchValues([selectedDatum.name], "domain");
    console.log(selection);
    setDeleteIds(selection);
    setSelectedDatum(null);
  };

  const signalListeners = {
    selectedDatum: onSelectDatum,
    selectedCategory: onSelectedCategory,
  };

  const popupStyle = {
    zIndex: 1,
    position: "absolute",
    left: selectedDatum ? selectedDatum.x : 0,
    top: selectedDatum ? selectedDatum.y : 0,
  };

  return (
    <div style={{ position: "relative" }}>
      <Dimmer active={loading}>
        <Loader />
      </Dimmer>
      <BubbleChartSpec
        data={data}
        signalListeners={signalListeners}
        actions={false}
        renderer={"svg"}
      />
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

const createTreeData = (dashData, selection, domainInfo) => {
  let domains = dashData.count("domain", selection);
  domains = Object.keys(domains).map((name) => ({ name, count: domains[name] }));
  domains.sort((a, b) => b.count - a.count); // sort from high to low value

  const nodes = [];
  let categories = {};
  let rank = 1;
  for (let domain of domains) {
    const category =
      domainInfo?.[domain.name]?.category || "." + domain.name.split(".").slice(-1)[0] || "other";
    let logo = domainInfo?.[domain.name]?.logo
      ? domainInfo[domain.name].logo
      : `https://icons.duckduckgo.com/ip3/${domain.name}.ico`;

    // Google has better quality, but not privacy friendly, and also misses quite a lot
    // We could use this to get good quality favicons and provide those as base64 from the amcat server
    // Or alternatively, look for higher quality links in the head
    // const logosize = 256;
    //  logo = `https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=${logo}&size=${logosize}`;

    if (!categories[category])
      categories[category] = {
        rank: 0,
        type: "category",
        name: category,
        count: 0,
        parent: "root",
        category,
      };
    categories[category].count++;

    nodes.push({
      rank: rank++,
      type: "domain",
      name: domain.name,
      parent: category,
      count: domain.count,
      category,
      logo,
    });
  }
  categories = Object.values(categories);

  return { tree: [{ name: "root", type: "root", rank: 0 }, ...categories, ...nodes] };
};

export default React.memo(BubbleChart);
