import React, { useEffect, useState } from "react";
import { Pagination, Icon, Item, Container } from "semantic-ui-react";
import db from "../apis/dexie";

const PAGESIZE = 10;
const ITEMSTYLE = { color: "white" };

const DataList = ({ table, layout, selection }) => {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!table) {
      setData([]);
      return null;
    }
    fetchFromDb(table, PAGESIZE, setPages, setData, selection);
  }, [table, selection]);

  const pageChange = async (event, data) => {
    const offset = (data.activePage - 1) * PAGESIZE;
    let newdata = null;
    if (selection === null) {
      newdata = await db.getTableBatch(table, offset, PAGESIZE);
    } else {
      newdata = await db.getTableFromIds(table, selection.slice(offset, offset + PAGESIZE));
    }
    setData(newdata);
  };

  const createItem = item => {
    return Object.keys(layout).map(field => {
      let content = item[field];
      if (content instanceof Date)
        content = content
          .toISOString()
          .slice(0, 19)
          .replace(/T/g, " ");
      if (field === "url")
        content = (
          <a style={{ color: "#79a9ec" }} href={content}>
            {content.split("?")[0]}
          </a>
        );

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

    const image = Object.keys(layout).find(field => layout[field].type === "image");

    return data.map((item, i) => {
      return (
        <Item key={i} style={ITEMSTYLE}>
          {image ? <Item.Image size="tiny" src={item[image]} /> : null}
          <Item.Content>{createItem(item)}</Item.Content>
        </Item>
      );
    });
  };

  return (
    <Container>
      <br />
      {pages > 1 ? (
        <Pagination
          style={{ background: "white", width: "100%", fontSize: 8 }}
          size="mini"
          floated="right"
          boundaryRange={1}
          siblingRange={1}
          ellipsisItem={{
            content: <Icon name="ellipsis horizontal" />,
            icon: true,
          }}
          firstItem={{
            content: <Icon name="angle double left" />,
            icon: true,
          }}
          lastItem={{
            content: <Icon name="angle double right" />,
            icon: true,
          }}
          prevItem={{ content: <Icon name="angle left" />, icon: true }}
          nextItem={{
            content: <Icon name="angle right" />,
            icon: true,
          }}
          pointing
          secondary
          defaultActivePage={1}
          totalPages={pages}
          onPageChange={pageChange}
        ></Pagination>
      ) : null}
      <br />
      <Item.Group>{createItems()}</Item.Group>
    </Container>
  );
};

const fetchFromDb = async (table, pageSize, setPages, setData, selection) => {
  let n = null;
  if (selection === null) {
    n = await db.getTableN(table);
  } else {
    n = selection.length;
  }
  setPages(Math.ceil(n / pageSize));
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
