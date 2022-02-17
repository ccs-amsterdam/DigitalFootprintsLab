import React from "react";
import CardTemplate from "./CardTemplate";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { List } from "semantic-ui-react";

const requestedData = ["Browsing", "Search", "Youtube"];

/**
 * Returns all donate cards to be rendered on the home page.
 */
const DonateCardColumn = () => {
  const statuses = useSelector((state) => state.dataStatus);
  if (!statuses.find((s) => s.status === "finished")) return null;

  return (
    <>
      <FilterCard />
      <DonateCard requestedData={requestedData} />
    </>
  );
};

const FilterCard = () => {
  const navigate = useNavigate();

  const onClick = () => {
    navigate("/remove");
  };

  return (
    <CardTemplate
      name={"Remove sensitive data"}
      subname={"Use keywords to search and remove any data that you prefer not to share"}
      icon={"user secret"}
      onClick={onClick}
    ></CardTemplate>
  );
};

const DonateCard = ({ requestedData }) => {
  const statuses = useSelector((state) => state.dataStatus);

  const gathered = requestedData.map((name) => {
    const status = statuses.find((s) => s.name === name);
    return status ? status : { name, status: "empty" };
  });

  const navigate = useNavigate();

  const onClick = () => {
    navigate("/remove");
  };

  return (
    <CardTemplate
      name={"Go to donation screen"}
      subname={"If you have gathered all the data that you can"}
      icon={"flag checkered"}
      onClick={onClick}
    >
      <List style={{ textAlign: "left", paddingTop: "10px" }}>
        {gathered.map((g, i) => statusMessage(g, i))}
      </List>
    </CardTemplate>
  );
};

const statusMessage = (gathered, i) => {
  console.log(gathered);
  const name = gathered.name.replace("_", " ");

  if (gathered.status === "finished")
    return (
      <List.Item key={i}>
        <List.Icon name="check circle outline" color="green" />
        <List.Content>
          <b>{name}</b> data ready
        </List.Content>
      </List.Item>
    );

  return (
    <List.Item key={i}>
      <List.Icon name="circle outline" />
      <List.Content>
        <b>{name}</b>
      </List.Content>
    </List.Item>
  );
};

export default DonateCardColumn;
