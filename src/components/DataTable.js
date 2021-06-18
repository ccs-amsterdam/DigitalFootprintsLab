import React, { useEffect, useState } from "react";
import { Container, Pagination, Table, Icon } from "semantic-ui-react";
import db from "../apis/dexie";

const PAGESIZE = 10;

const DocumentTable = ({ table, columns, widths }) => {
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    if (!table) {
      setData([]);
      return null;
    }
    fetchFromDb(table, PAGESIZE, setPages, setData);
  }, [table]);

  const createHeaderRow = (data) => {
    return columns.map((colname, i) => {
      return (
        <Table.HeaderCell key={i} width={widths[i]}>
          <span title={colname}>{colname}</span>
        </Table.HeaderCell>
      );
    });
  };

  const createBodyRows = (data) => {
    console.log(data.length);
    while (data.length < PAGESIZE) data.push(null);
    console.log(data);
    return data.map((rowObj, i) => {
      return (
        <Table.Row key={i} style={{ height: "3.1em" }}>
          {createRowCells(rowObj)}
        </Table.Row>
      );
    });
  };

  const createRowCells = (rowObj) => {
    return columns.map((key, i) => {
      let content = rowObj ? rowObj[key] : null;
      if (content instanceof Date) content = content.toString();
      return (
        <Table.Cell key={i}>
          <span title={content}>{content}</span>
        </Table.Cell>
      );
    });
  };

  const pageChange = async (event, data) => {
    const offset = (data.activePage - 1) * PAGESIZE;
    const newdata = await db.getTableBatch(table, offset, PAGESIZE);
    setData(newdata);
  };

  if (data.length < 1) return null;

  return (
    <Container style={{ marginTop: "2em" }}>
      <Table
        unstackable
        selectable
        fixed
        compact
        singleLine
        size="small"
        style={{ fontSize: "10px" }}
      >
        <Table.Header>
          <Table.Row>{createHeaderRow(data, columns)}</Table.Row>
        </Table.Header>
        <Table.Body>{createBodyRows(data)}</Table.Body>
        <Table.Footer>
          <Table.Row>
            <Table.HeaderCell colSpan={columns.length}>
              {pages > 1 ? (
                <Pagination
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
                  onClick={() => console.log("wtf")}
                  onPageChange={pageChange}
                ></Pagination>
              ) : null}
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    </Container>
  );
};

const fetchFromDb = async (table, pageSize, setPages, setData) => {
  const n = await db.getTableN(table);
  setPages(Math.ceil(n / pageSize));
  let newdata = [];
  if (n > 0) newdata = await db.getTableBatch(table, 0, pageSize);

  setData(newdata);
};

export default DocumentTable;
