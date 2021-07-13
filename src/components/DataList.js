import React, { useEffect, useRef, useState } from "react";
import {
  Pagination,
  Icon,
  Item,
  Container,
  Button,
  Visibility,
  Header,
  Confirm,
  Modal,
  Checkbox,
  ButtonGroup,
  Dimmer,
  Loader,
  Segment,
} from "semantic-ui-react";
import db from "../apis/dexie";

const PAGESIZE = 25;
const ITEMSTYLE = { color: "white" };

const DataList = ({ table, layout, selection, loading }) => {
  const [data, setData] = useState([]);
  const [n, setN] = useState(1);
  const [selectionN, setSelectionN] = useState(1);

  const [confirm, setConfirm] = useState({ open: false, ask: true, itemIds: [] });

  useEffect(() => {
    if (!table) {
      setData([]);
      return null;
    }
    fetchFromDb(table, PAGESIZE, setN, setSelectionN, setData, selection);
  }, [table, selection, confirm]);

  const onBottomVisible = async () => {
    // infinite scroll
    // <Visibility> checks whether bottom of (invisible) div is visible, and if so adds more data
    const offset = data.length;
    let newdata = null;
    if (selection === null) {
      newdata = await db.getTableBatch(table, offset, PAGESIZE);
    } else {
      newdata = await db.getTableFromIds(table, selection.slice(offset, offset + PAGESIZE));
    }
    setData([...data, ...newdata]);
  };

  const createItem = (item) => {
    return Object.keys(layout).map((field) => {
      let content = item[field];
      if (content instanceof Date) content = content.toISOString().slice(0, 19).replace(/T/g, " ");
      if (field === "url") {
        let url = new URL(content);
        content = (
          <p>
            <font style={{ fontSize: "1.5em", color: "lightblue" }}>{url.hostname}</font>
            {url.pathname}
          </p>
        );
        //content = content.split("?")[0];
        // content = (
        //     <a style={{ color: "#79a9ec" }} href={content} target="_blank" rel="noopener noreferrer">
        //       {content.split("?")[0]}
        //     </a>
        //  );
      }

      if (layout[field].type === "header")
        return <Item.Header style={layout[field].style}>{content}</Item.Header>;
      if (layout[field].type === "meta")
        return <Item.Meta style={layout[field].style}>{content}</Item.Meta>;
      if (layout[field].type === "description")
        return <Item.Description style={layout[field].style}>{content}</Item.Description>;
      if (layout[field].type === "extra")
        return <Item.Extra style={layout[field].style}>{content}</Item.Extra>;
      return { content };
    });
  };

  const createItems = () => {
    if (data === null || data.length === 0) return null;

    const image = Object.keys(layout).find((field) => layout[field].type === "image");

    return data.map((item, i) => {
      return (
        <Item key={i} style={ITEMSTYLE}>
          {image ? <Item.Image size="tiny" src={item[image]} /> : null}
          <Button
            onClick={() => setConfirm({ ...confirm, open: true, itemIds: [item.id] })}
            icon="trash alternate"
            style={{ padding: "0", color: "black", height: "3em", background: "#b23434bd" }}
          />
          <Item.Content>{createItem(item)}</Item.Content>
        </Item>
      );
    });
  };

  return (
    <Container
      style={{
        height: "98%",
        border: "1px solid",
        borderColor: "white",
        padding: "1em",
        background: "#00000087",
      }}
    >
      <Segment style={{ background: "white" }}>
        <Header textAlign="center" as="h1" style={{ color: "black" }}>
          <Dimmer active={loading}>
            <Loader />
          </Dimmer>
          {selectionN === n ? null : (
            <Button
              onClick={() => setConfirm({ ...confirm, open: true, itemIds: selection })}
              icon="trash alternate"
              style={{ color: "#b23434bd", height: "1em", background: "#ffffff00" }}
            />
          )}
          {selectionN === n ? n : `${selectionN} / ${n}`} items
        </Header>
      </Segment>

      <Container style={{ height: "95%", overflowY: "auto" }}>
        <Visibility continuous onBottomVisible={onBottomVisible}>
          <Item.Group unstackable>{createItems()}</Item.Group>
        </Visibility>
      </Container>

      <ConfirmModal table={table} confirm={confirm} setConfirm={setConfirm} />
    </Container>
  );
};

const ConfirmModal = ({ table, confirm, setConfirm }) => {
  const [ask, setAsk] = useState(!confirm.ask);
  const n = confirm.itemIds.length;

  const handleDelete = async () => {
    await db.deleteTableIds(table, confirm.itemIds);
    setConfirm({ open: false, ask: !ask, itemIds: [] });
  };

  if (!confirm.open) return null;

  if (!confirm.ask && n === 1) {
    handleDelete();
    return null;
  }

  return (
    <Modal
      style={{ backgroundColor: "#00000054" }}
      open={confirm.open}
      onClose={() => setConfirm({ ...confirm, open: false })}
    >
      <Modal.Header>Delete item{n === 1 ? "" : "s"}</Modal.Header>
      <Modal.Content>
        <p>Are you sure you want to delete {n === 1 ? "this item" : `${n} items`}?</p>

        <br />
        <Modal.Actions>
          <ButtonGroup centered>
            <Button
              fluid
              primary
              onClick={() => setConfirm({ open: false, ask: !ask, itemIds: [] })}
            >
              Cancel
            </Button>
            <Button fluid color="red" onClick={(e, d) => handleDelete()}>
              Yes
            </Button>
          </ButtonGroup>
          {n > 1 ? null : (
            <Checkbox
              style={{ float: "right" }}
              onChange={(e, d) => setAsk(!d.value)}
              label="Do not ask again. Next time, delete immediately when clicking the trash icon"
            />
          )}
        </Modal.Actions>
      </Modal.Content>
    </Modal>
  );
};

const fetchFromDb = async (table, pageSize, setN, setSelectionN, setData, selection) => {
  let n = await db.getTableN(table);
  setSelectionN(selection === null ? n : selection.length);
  setN(n);
  let newdata = [];

  if (n > 0) {
    if (selection === null) {
      newdata = await db.getTableBatch(table, 0, pageSize);
    } else {
      newdata = await db.getTableFromIds(table, selection.slice(0, PAGESIZE));
    }
  }

  setData(newdata);
};

export default React.memo(DataList);
