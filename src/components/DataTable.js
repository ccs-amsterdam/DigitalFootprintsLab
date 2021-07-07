import React, { useEffect, useState } from "react";
import { Container, Pagination, Table, Icon, Input, Dimmer, Loader } from "semantic-ui-react";
import db from "../apis/dexie";

const PAGESIZE = 10;

const DocumentTable = ({ table, columns, selection, allColumns }) => {
  // table from db
  // columns is array of objects with name (of field) and width
  // allColumns is bool for whether or not to include the rest of the columns
  const [data, setData] = useState([]);
  const [pages, setPages] = useState(1);
  const [useColumns, setUseColumns] = useState(columns);

  useEffect(() => {
    if (!table) {
      setData([]);
      return null;
    }
    fetchFromDb(table, PAGESIZE, setPages, setData, columns, allColumns, setUseColumns, selection);
  }, [table, columns, allColumns, selection]);

  const createHeaderRow = () => {
    return useColumns.map((column, i) => {
      return (
        <Table.HeaderCell key={i} width={column.width}>
          <span title={column.name}>{column.name}</span>
        </Table.HeaderCell>
      );
    });
  };

  const createBodyRows = (data) => {
    if (data === null || data.length === 0) return null;

    while (data.length < PAGESIZE) data.push(null);
    return data.map((rowObj, i) => {
      return (
        <Table.Row key={i} style={{ height: "3.1em" }}>
          {createRowCells(rowObj)}
        </Table.Row>
      );
    });
  };

  const createRowCells = (rowObj) => {
    return useColumns.map((column, i) => {
      let content = rowObj ? rowObj[column.name] : null;
      if (content instanceof Date) content = content.toISOString().slice(0, 19).replace(/T/g, " ");
      return (
        <Table.Cell key={i}>
          <span title={content}>{content}</span>
        </Table.Cell>
      );
    });
  };

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

  return (
    <Container style={{ overflow: "auto" }}>
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

const fetchFromDb = async (
  table,
  pageSize,
  setPages,
  setData,
  columns,
  allColumns,
  setUseColumns,
  selection
) => {
  let n = null;
  if (selection === null) {
    n = await db.getTableN(table);
  } else {
    n = selection.length;
  }
  setPages(Math.ceil(n / pageSize));
  let newdata = [];
  const useColumns = [...columns];

  if (n > 0) {
    if (selection === null) {
      newdata = await db.getTableBatch(table, 0, pageSize);
    } else {
      newdata = await db.getTableFromIds(table, selection.slice(0, PAGESIZE));
    }
    if (allColumns) addBatchColumns(useColumns, newdata); // pushes to useColumns
  }

  setUseColumns(useColumns);
  setData(newdata);
};

const addBatchColumns = (columns, data) => {
  const colnames = columns.map((col) => col.name);

  for (let row of data) {
    for (let cname of Object.keys(row)) {
      if (!colnames.includes(cname)) {
        colnames.push(cname);
        columns.push({ name: cname, width: 2 });
      }
    }
  }
};

export default React.memo(DocumentTable);
