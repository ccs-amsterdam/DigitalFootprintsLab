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
      question.question.value,
      question.data.value,
      question.field.value,
      question.detail.value,
      setData,
      setDone,
      setStatus
    );
  }, [setDone, question]);

  useEffect(() => {
    // check if all the items in the top have been annotated (if so, user is done with this question)
    if (!data) return;
    let topAnswered = true;
    for (let item of Object.values(data.answers.items)) {
      if (!item.answer) topAnswered = false;
    }
    if (data.answers.added.length === 0 && !data.answers.nothing_to_add) topAnswered = false;

    db.setAnswers(question.question.value, data.answers);
    setDone(topAnswered);
  }, [data, question, setDone]);

  const onDropdownChange = (e, d) => {
    const items = d.value;
    for (let item of items) {
      // if item is added to dropdown, add to list
      if (!data.answers.items[item]) data.answers.items[item] = { manually_added: true };
    }

    for (let item of Object.keys(data.answers.items)) {
      // if item has been removed from dropdown, remove from list
      if (data.answers.items[item].manually_added && !items.includes(item))
        delete data.answers.items[item];
    }

    data.answers.added = items;
    if (items.length > 0) data.answers.nothing_to_add = false;
    setData({ ...data });
  };

  const onClick = (e, d) => {
    data.answers.nothing_to_add = !data.answers.nothing_to_add;
    setData({ ...data });
  };

  if (status === "no data")
    return (
      <p style={{ color: "red" }}>
        <Trans
          i18nKey="donate.annotate.nodata"
          values={{ data: question?.data?.value }}
          components={{ b: <b /> }}
        />
      </p>
    );
  if (!data) return null;

  const added = data?.answers?.added || [];
  const noAdd = data?.answers?.nothing_to_add || false;

  return (
    <>
      <Grid.Row style={{ background: "#1678c2", color: "white", borderRadius: "5px" }}>
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

      {
        //Object.keys(data.annotations[question.field.value]).map((fieldvalue, i) => {
        Object.keys(data.answers.items).map((item, i) => {
          return (
            <ItemForm
              key={item}
              data={data}
              setData={setData}
              field={question.field.value}
              itemvalue={item}
              question={question}
            />
          );
        })
      }

      <Grid.Row>
        <Grid.Column width={10}>
          <br />
          <p style={{ fontSize: "1.3em" }}>{question?.canAddIntro?.trans}</p>
          <div style={{ display: "flex" }}>
            <Dropdown
              search
              fluid
              selection
              multiple
              placeholder={t("donate.annotate.dropdown")}
              options={data?.dropdownOptions || []}
              renderLabel={(item) => ({ content: item.value })}
              value={added}
              onChange={onDropdownChange}
              style={{ border: "1px solid #cce2ff", minHeight: "70px" }}
            />

            <Button
              primary
              disabled={added.length > 0}
              icon={noAdd ? "check" : ""}
              positive={noAdd}
              content={t("donate.annotate.noadd", "Nothing to add!")}
              onClick={onClick}
            />
          </div>
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

const ItemForm = ({ data, setData, field, itemvalue, question }) => {
  const item = data.items.find((item) => item.name === itemvalue);
  const answer = data.answers.items[itemvalue].answer;

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
                      newData.answers.items[item.name].answer = a.value;

                      setData(newData);
                    }}
                    style={{
                      padding: "8px 12px",
                      color: active ? "white" : "black",
                      background: active ? "#1678c2" : "#cce2ff",
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
      trigger={
        <Button
          size="small"
          circular
          icon="list ul"
          style={{ cursor: "pointer", background: "#cce2ff" }}
        />
      }
    >
      <List>
        {item.details.map((detail, i) => {
          return <List.Item key={detail + i}>{detail}</List.Item>;
        })}
      </List>
    </Popup>
  );
};

const prepareData = async (top, question, dataName, field, detail, setData, setDone, setStatus) => {
  const data = await db.getData(dataName);
  const answers = (await db.getAnswers(question)) || {};
  if (!answers.items) answers.items = {};
  if (!answers.added) answers.added = [];
  if (!answers.nothing_to_add) answers.nothing_to_add = false;

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

  items = Object.keys(items).map((name) => ({ name, ...items[name] }));
  items.sort((a, b) => b.count - a.count); // sort from high to low value

  const currentTop = {};
  for (let i = 0; i < items.length && i < top; i++) {
    const item = items[i];
    currentTop[item.name] = true;
    if (!answers.items[item.name]) answers.items[item.name] = {};
    answers.items[item.name].manually_added = false;
    answers.items[item.name].frequency_rank = i + 1;
  }

  for (let item of Object.keys(answers.items)) {
    // if data is filtered, previous top items might have dropped out, so remove them.
    if (!answers.items[item].manually_added && !currentTop[item]) delete answers.items[item];
  }

  const dropdownOptions = items.reduce((options, item) => {
    if (answers.items[item.name] && !answers.items[item.name].manually_added) return options;
    options.push({
      key: item.name,
      value: item.name,
      content: item.name,
      text: item.details.join(" "),
    });
    return options;
  }, []);

  setData({ items, answers, dropdownOptions });
};

export default AnnotateTopItems;
