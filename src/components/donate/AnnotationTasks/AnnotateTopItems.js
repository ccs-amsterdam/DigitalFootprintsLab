import React, { useState, useEffect } from "react";
import db from "apis/db";
import { Button, Grid, Header, Popup, List, Dropdown } from "semantic-ui-react";

import ignoreIds from "data/youtube_ignore_ids.json";
import { Trans, useTranslation } from "react-i18next";
import transCommon from "util/transCommon";

const ignoreIdsMap = ignoreIds.ids.reduce((obj, id) => {
  // this is ugly, but we just hard coded an ignorelist for now
  obj[id] = true;
  return obj;
}, {});

const AnnotateTopItems = ({ question, setDone }) => {
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("idle");
  const { t } = useTranslation();

  useEffect(() => {
    prepareData(
      question.top.value,
      question.data.value,
      question.field.value,
      question.detail.value,
      setData,
      setDone,
      setStatus
    );
  }, [setDone, question]);

  console.log(data);
  useEffect(() => {
    // check if all the items in the top have been annotated (if so, user is done with this question)
    if (!data) return;
    let topAnnotated = true;
    for (let annotation of Object.values(data.annotations[question.field.value])) {
      if (!annotation.news_score) topAnnotated = false;
    }
    db.setDataAnnotations(data.annotations, question.data.value);
    setDone(topAnnotated);
  }, [data, question, setDone]);

  const onDropdownChange = (e, d) => {
    for (let value of d.value) {
      if (!data.annotations[question.field.value][value])
        data.annotations[question.field.value][value] = { manually_added: true };
    }

    for (let fieldvalue of Object.keys(data.annotations[question.field.value])) {
      if (
        data.annotations[question.field.value][fieldvalue].manually_added &&
        !d.value.includes(fieldvalue)
      )
        delete data.annotations[question.field.value][fieldvalue];
    }

    setData({ ...data });
  };

  if (status === "no data") return <p style={{ color: "red" }}>No data available</p>;
  if (!data) return null;

  const dropdownValues = [];
  for (let [value, a] of Object.entries(data.annotations[question.field.value])) {
    if (a.manually_added) dropdownValues.push(value);
  }

  return (
    <Grid centered stackable>
      <Grid.Row>
        <Grid.Column width={10}>
          <p>
            <Trans i18nKey="donate.annotate.p1" components={{ b: <b /> }} />
          </p>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ background: "#737373", color: "white", borderRadius: "5px" }}>
        <Grid.Column width={7}>
          <b>{question.field.trans.toUpperCase()}</b>
        </Grid.Column>
        <Grid.Column width={2}>
          <b>{question.detail.trans.toUpperCase()}</b>
          <br />
          <b>{transCommon("LIST", t)}</b>
        </Grid.Column>
        <Grid.Column width={7}>
          <b>{question.question.trans.toUpperCase()}</b>
        </Grid.Column>
      </Grid.Row>

      {Object.keys(data.annotations[question.field.value]).map((fieldvalue, i) => {
        return (
          <ItemForm
            key={fieldvalue}
            data={data}
            setData={setData}
            field={question.field.value}
            value={fieldvalue}
            question={question}
          />
        );
      })}

      <Grid.Row>
        <Grid.Column width={10}>
          <br />
          <p>
            <Trans i18nKey="donate.annotate.p2" components={{ b: <b /> }} />
          </p>
          <Dropdown
            search
            fluid
            selection
            multiple
            placeholder={t("donate.annotate.dropdown")}
            options={data?.dropdownOptions || []}
            renderLabel={(item) => ({ content: item.value })}
            value={dropdownValues}
            onChange={onDropdownChange}
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  );
};

const ItemForm = ({ data, setData, field, value, question }) => {
  const item = data.items.find((item) => item.name === value);
  const answer = data.annotations[field][value].news_score;

  console.log(question);
  return (
    <Grid.Row style={{ paddingTop: "7px", paddingBottom: "0px" }}>
      <Grid.Column width={7}>
        <Header as="h4">{item.name} </Header>
      </Grid.Column>
      <Grid.Column width={2}>
        <ItemDetails item={item} />
      </Grid.Column>
      <Grid.Column width={7}>
        <Button.Group fluid size="small">
          {question.answers.map((a, i) => {
            const active = answer === a.value;
            return (
              <Popup
                key={a.value + i}
                trigger={
                  <Button
                    key={a.value}
                    active={active}
                    onClick={() => {
                      const newData = { ...data };
                      newData.annotations[field][item.name].news_score = a.value;
                      setData(newData);
                    }}
                    style={{
                      padding: "8px 12px",
                      color: active ? "white" : "black",
                      background: active ? "blue" : "#bbbbbb",
                    }}
                  >
                    {i + 1}
                  </Button>
                }
              >
                {a.trans}
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
      trigger={<Button size="small" circular icon="list ul" style={{ cursor: "pointer" }} />}
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

  const ignored_channels = {};
  let items = data.data.reduce((items, item) => {
    const id = item.channel_url?.split("/channel/").slice(-1)[0];
    if (ignoreIdsMap[id]) {
      if (!ignored_channels[item.channel]) ignored_channels[item.channel] = 0;
      ignored_channels[item.channel]++;
      return items;
    }
    if (!item[field] || item[field] === "undefined") return items;
    if (!items[item[field]]) items[item[field]] = { count: 0, details: [] };
    items[item[field]].count++;
    items[item[field]].details.push(item[detail]);
    return items;
  }, {});

  console.log("ignored channels", ignored_channels);

  items = Object.keys(items).map((name) => ({ name, ...items[name] }));
  items.sort((a, b) => b.count - a.count); // sort from high to low value

  const annotations = await db.getDataAnnotations(dataName);
  //const annotations = {};
  if (!annotations[field]) annotations[field] = {};

  const currentTop = {};
  for (let i = 0; i < items.length && i < top; i++) {
    const item = items[i];
    currentTop[item.name] = true;
    if (!annotations[field][item.name]) annotations[field][item.name] = {};
    annotations[field][item.name].manually_added = false;
    annotations[field][item.name].frequency_rank = i + 1;
  }

  for (let key of Object.keys(annotations[field])) {
    // if data is filtered, previous top items might have dropped out, so remove them.
    if (!annotations[field][key].manually_added && !currentTop[key]) delete annotations[field][key];
  }

  const dropdownOptions = items.reduce((options, item) => {
    if (annotations[field][item.name] && !annotations[field][item.name].manually_added)
      return options;
    options.push({
      key: item.name,
      value: item.name,
      content: item.name,
      text: item.details.join(" "),
    });
    return options;
  }, []);

  setData({ items, annotations, dropdownOptions });
};

export default AnnotateTopItems;
