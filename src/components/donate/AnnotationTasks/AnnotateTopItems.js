import React, { useState, useEffect } from "react";
import db from "apis/db";
import { Button, Icon, Grid, Header, Popup, List } from "semantic-ui-react";

// For now we'll just make this a fixed task
const top = 10;
const dataName = "Youtube";
const field = "channel";
const detail = "title";
const question = {
  question: "Some smart question to measure whether the channel covers news",
  answers: [
    "Strongly Disagree",
    "Disagree",
    "Somewhat Disagree",
    "Neither Agree nor Disagree",
    "Somewhat Agree",
    "Agree",
    "Strongly Agree",
  ],
};

const AnnotateTopItems = ({ setDone }) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");

  useEffect(() => {
    prepareData(top, dataName, field, detail, setData, setDone, setStatus);
  }, [setDone]);

  useEffect(() => {
    // check if all the items in the top have been annotated (if so, user is done)
    if (!data) return;
    let topAnnotated = true;
    for (let item of data.topItems) if (!data.annotations.topItems[item.name]) topAnnotated = false;
    db.setDataAnnotations(data.annotations, dataName);
    setDone(topAnnotated);
  }, [data, setDone]);

  if (status === "no data") return <p style={{ color: "red" }}>No data available</p>;
  if (!data) return null;
  return (
    <Grid stackable>
      <Grid.Row style={{ background: "#737373", color: "white", borderRadius: "5px" }}>
        <Grid.Column width={7}>
          <b>{field.toUpperCase()}</b>
        </Grid.Column>
        <Grid.Column width={2}>
          <b>{detail.toUpperCase()}</b>
          <br />
          <b>LIST</b>
        </Grid.Column>
        <Grid.Column width={7}>
          <b>{question.question.toUpperCase()}</b>
        </Grid.Column>
      </Grid.Row>

      {data.topItems.map((item, i) => {
        return <ItemForm key={item.name} data={data} setData={setData} i={i} question={question} />;
      })}
    </Grid>
  );
};

const ItemForm = ({ data, setData, i, question }) => {
  const item = data.topItems[i];
  const answer = data.annotations.topItems[item.name];

  return (
    <Grid.Row>
      <Grid.Column width={7}>
        <Header as="h4">{item.name} </Header>
      </Grid.Column>
      <Grid.Column width={2}>
        <ItemDetails item={item} />
      </Grid.Column>
      <Grid.Column width={7}>
        <Button.Group fluid size="small">
          {question.answers.map((a, i) => {
            return (
              <Popup
                key={a + i}
                trigger={
                  <Button
                    key={a}
                    active={answer === a}
                    onClick={() => {
                      const newData = { ...data };
                      newData.annotations.topItems[item.name] = a;
                      setData(newData);
                    }}
                    style={{ padding: "8px 12px" }}
                  >
                    {i + 1}
                  </Button>
                }
              >
                {a}
              </Popup>
            );
          })}
        </Button.Group>
      </Grid.Column>
    </Grid.Row>
  );
};

const ItemDetails = ({ item }) => {
  if (!item.details) return null;
  return (
    <Popup
      on="click"
      style={{ maxHeight: "300px", overflow: "auto" }}
      wide="very"
      trigger={<Icon name="list ul" style={{ cursor: "pointer" }} />}
    >
      <List>
        {item.details.map((detail, i) => {
          return <List.Item key={detail + i}>{detail}</List.Item>;
        })}
      </List>
    </Popup>
  );
};

const prepareData = async (top, dataName, field, detail, setData, setDone, setStatus) => {
  const data = await db.getData(dataName);
  if (!data) {
    setStatus("no data");
    setDone(true);
    setData(null);
    return;
  }

  let items = data.reduce((items, item) => {
    if (!item[field] || item[field] === "undefined") return items;
    if (!items[item[field]]) items[item[field]] = { count: 0, details: [] };
    items[item[field]].count++;
    items[item[field]].details.push(item[detail]);
    return items;
  }, {});

  items = Object.keys(items).map((name) => ({ name, ...items[name] }));
  items.sort((a, b) => b.count - a.count); // sort from high to low value
  const topItems = items.slice(0, top);

  const annotations = await db.getDataAnnotations(dataName);
  console.log(annotations);
  if (!annotations.topItems) annotations.topItems = {};

  setData({ topItems, items, annotations });
};

export default AnnotateTopItems;
