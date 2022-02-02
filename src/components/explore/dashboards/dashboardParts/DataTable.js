import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Container, Button, Visibility, Header, Segment, Table } from "semantic-ui-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const PAGESIZE = 25;

const propTypes = {
  /** The name of the table in DB */
  table: PropTypes.string,
  /** An array indicating what columns should be shown and how.
   * Items can be simple strings with columns names, or objects of {name: 'column name': f: function, width: int }
   * f and width are optional. f is a function with the row object as an argument and should return the value to display
   * width is an integer between 1 and 16 for semantic style width hints */
  columns: PropTypes.array,
  /** An array with row IDs to filter on */
  selection: PropTypes.array,
  /** A string to indicate the loading status */
  loading: PropTypes.bool,
};

/**
 * Creates a table for a given table in the indexedDB
 */
const DataTable = ({ dashData, columns, selection }) => {
  const [n, setN] = useState(0);
  const [data, setData] = useState([]);
  const [selectionN, setSelectionN] = useState(0);
  const [deleteIds, setDeleteIds] = useState([]);

  useEffect(() => {
    if (!dashData) {
      setData([]);
      return null;
    }
    setSelectionN(dashData.N(selection));
    setData(dashData.listData(PAGESIZE, selection));
    setN(dashData.N());
  }, [dashData, selection]);

  const onBottomVisible = async () => {
    // infinite scroll
    // <Visibility> checks whether bottom of (invisible) div is visible, and if so adds more data
    setData(dashData.listData(data.length + PAGESIZE, selection));
  };

  return (
    <Container
      style={{
        height: "98%",
        width: "98%",
        padding: "0",
      }}
    >
      <Segment style={{ background: "#00000000", height: "55px", margin: "0" }}>
        <Header textAlign="center" as="h2" style={{ color: "white" }}>
          {selectionN === n ? null : (
            <Button
              onClick={() => setDeleteIds(selection)}
              icon="trash alternate"
              style={{
                color: "#b23434bd",
                padding: "0",
                marginBottom: "10px",
                background: "#ffffff00",
              }}
            />
          )}
          {selectionN === n ? n : `${selectionN} / ${n}`} items
        </Header>
      </Segment>
      <Container
        style={{
          height: "calc(100% - 55px)",
          width: "100%",
          overflow: "auto",
          paddingLeft: "20px",
        }}
      >
        <Visibility continuous onBottomVisible={onBottomVisible}>
          <ScrollingTable dashData={dashData} data={data} columns={columns} />
        </Visibility>
      </Container>

      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </Container>
  );
};

const ScrollingTable = ({ dashData, data, columns }) => {
  const [deleteIds, setDeleteIds] = useState([]);

  const createHeader = () => {
    const columnsWithTrash = [{ name: "delete", width: 1 }, ...columns];
    const cells = columnsWithTrash.map((column) => {
      const name = typeof column === "object" ? column.name : column;
      return (
        <Table.HeaderCell
          key={column}
          width={column?.width}
          style={{ top: "0px", position: "sticky", zIndex: "2" }}
        >
          {name}
        </Table.HeaderCell>
      );
    });
    return (
      <Table.Header>
        <Table.Row>{cells}</Table.Row>
      </Table.Header>
    );
  };

  const createBody = () => {
    const rows = data.map((row, i) => {
      const cells = columns.map((column) => {
        const name = typeof column === "object" ? column.name : column;
        const f = column?.f || null;
        const content = processContent(row, name, f);
        return (
          <Table.Cell key={name + "_" + i} title={content}>
            {content}
          </Table.Cell>
        );
      });
      return (
        <Table.Row key={i}>
          <Table.Cell key="0">
            <Button
              style={{ padding: "5px", background: "red", color: "black" }}
              onClick={() => setDeleteIds([row._INDEX])}
              icon="trash alternate"
            />
          </Table.Cell>
          {cells}
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  if (data === null || data.length === 0 || !columns) return null;

  return (
    <Table
      unstackable
      fixed
      singleLine
      style={{ width: "100%", color: "white", background: "#00000099" }}
    >
      {createHeader()}
      {createBody()}
      <ConfirmDeleteModal dashData={dashData} deleteIds={deleteIds} setDeleteIds={setDeleteIds} />
    </Table>
  );
};

const processContent = (row, column, f) => {
  let content;
  if (f) {
    content = f(row);
  } else {
    content = row[column];
    if (content instanceof Date) content = content.toISOString().slice(0, 19).replace(/T/g, " ");
  }
  return content;
};

DataTable.propTypes = propTypes;
export default React.memo(DataTable);
