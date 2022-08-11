import React, { useEffect, useState } from "react";
import {
  Container,
  Button,
  Header,
  Segment,
  Table,
  Icon,
  Pagination,
  Popup,
} from "semantic-ui-react";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import { useTranslation } from "react-i18next";
import transCommon from "util/transCommon";
import { TableColumn } from "types";

/**
 * Creates a table for a given table in the indexedDB
 */
interface DataTableProps {
  dashData: any;
  /** An array indicating what columns should be shown and how.
   * Items can be simple strings with columns names, or objects of {name: 'column name': f: function, width: int }
   * f and width are optional. f is a function with the row object as an argument and should return the value to display
   * width is an integer between 1 and 16 for semantic style width hints */
  columns?: (string | TableColumn)[];
  /** An array with row IDs to filter on */
  selection?: number[];
  /** A function to send logs */
  log?: (any) => void;
  pagesize?: Number;
  unstackable?: boolean;
  title?: String;
  collapsable?: boolean;
  full?: boolean;
}

const DataTable = ({
  dashData,
  columns,
  selection,
  log,
  pagesize = 10,
  unstackable,
  title,
  collapsable = false,
  full,
}: DataTableProps) => {
  const [n, setN] = useState(0);
  const [data, setData] = useState([]);
  const [selectionN, setSelectionN] = useState(0);
  const [deleteIds, setDeleteIds] = useState([]);
  const [bulkDelete, setBulkDelete] = useState(null);
  const [collapsed, setCollapsed] = useState(collapsable);

  useEffect(() => {
    if (!dashData) {
      setData([]);
      return null;
    }
    if (dashData.is_subset) {
      if (selection) throw new Error("cannot use selection if dashData is a subset");
      setSelectionN(dashData.N());
      setData(dashData.listData(pagesize));
      setN(dashData.deleted.length);
      setBulkDelete(dashData.data.map((d) => d._INDEX));
    } else {
      setSelectionN(dashData.N(selection));
      setData(dashData.listData(pagesize, selection));
      setN(dashData.N());
      setBulkDelete(selection);
    }
  }, [dashData, selection, pagesize]);

  // const onBottomVisible = async () => {
  //   if (selectionN === data.length) return;
  //   setData(dashData.listData(data.length + pagesize, selection));
  // };

  const pageChange = async (page) => {
    if (selectionN === data.length) return;
    setData(dashData.listData(pagesize, selection, pagesize * (page - 1)));
  };

  const processDelete = async (ids) => {
    if (log) log(`Deleted ${ids.length} ${dashData.name} items`);
    await dashData.rmID(ids);
  };

  if (!dashData) return null;
  if (!selectionN) return null;

  return (
    <Container
      style={{
        width: "100%",
        padding: "0",
        margin: "0",
      }}
    >
      <Segment style={{ background: "#00000000", width: "100%", paddingBottom: "0", margin: "0" }}>
        <Header textAlign="center" as="h3" style={{ width: "100%", color: "white" }}>
          {title}
          {title ? <br /> : null}
          {bulkDelete ? (
            <Button
              onClick={() => setDeleteIds(bulkDelete)}
              icon="trash alternate"
              size="small"
              style={{
                color: "crimson",
                padding: "2 0 0 0",
                fontSize: "1em",
                marginBottom: "10px",
                background: "#ffffff00",
              }}
            />
          ) : null}
          {selectionN === n ? n : `${selectionN} / ${n}`} items
          <Button
            icon={collapsed ? "caret right" : "caret down"}
            size="small"
            onClick={() => setCollapsed(!collapsed)}
            style={{
              color: "white",
              background: "transparent",
              padding: "5px 5px 5px 5px",
            }}
          ></Button>
        </Header>
      </Segment>
      <div
        style={{
          display: collapsed ? "none" : null,
          height: "calc(100% - 55px)",
          width: "100%",
          overflow: "auto",
          //paddingLeft: "20px",
          //marginLeft: "1px !important",
          padding: "0",
        }}
      >
        <PaginationTable
          data={data}
          columns={columns}
          pages={Math.ceil(selectionN / pagesize)}
          pageChange={pageChange}
          processDelete={processDelete}
          unstackable={unstackable}
          full={full}
        />
      </div>

      <ConfirmDeleteModal
        processDelete={processDelete}
        deleteIds={deleteIds}
        setDeleteIds={setDeleteIds}
      />
    </Container>
  );
};

const PaginationTable = ({
  data,
  columns,
  pages,
  pageChange,
  processDelete,
  unstackable,
  full,
}) => {
  const [deleteIds, setDeleteIds] = useState([]);
  const { t } = useTranslation();

  const createHeader = (columns) => {
    const columnsWithTrash = [{ name: "", width: 1 }, ...columns];
    const cells = columnsWithTrash.map((column) => {
      let name = typeof column === "object" ? column.name : column;
      name = name.replace("_", " ").trim();
      return (
        <Table.HeaderCell
          key={column}
          width={column?.width}
          style={{
            top: "0px",
            position: "sticky",
            zIndex: "2",
            background: "white",
            paddingTop: "3px",
            paddingBottom: "3px",
          }}
        >
          {transCommon(name.toUpperCase(), t)}
        </Table.HeaderCell>
      );
    });
    return (
      <Table.Header style={{ background: "white" }}>
        <Table.Row>{cells}</Table.Row>
      </Table.Header>
    );
  };

  const createBody = (columns) => {
    const rows = data.map((row, i) => {
      const cells = columns.map((column) => {
        const name = typeof column === "object" ? column.name : column;
        const f = column?.f || null;
        const content = processContent(row, name, f);
        return (
          <Table.Cell key={name + "_" + i} title={content}>
            <PopupCell text={content} />
          </Table.Cell>
        );
      });
      return (
        <Table.Row key={i}>
          <Table.Cell key="0" style={{ padding: "3px" }}>
            <Button
              size="normal"
              style={{
                padding: "3px",
                background: "transparent",
                color: "crimson",
              }}
              onClick={() => setDeleteIds([row._INDEX])}
              icon="cancel"
            />
          </Table.Cell>
          {cells}
        </Table.Row>
      );
    });
    return <Table.Body>{rows}</Table.Body>;
  };

  //if (data === null || data.length === 0) return null;

  let showColumns = new Set([]);
  if (columns) {
    showColumns = columns;
  } else {
    for (let row of data) {
      for (let col of Object.keys(row)) {
        showColumns.add(col);
      }
    }
    showColumns = [...showColumns];
  }
  //if (!columns) columns = Object.keys(data[0] || {}).filter((c) => c !== "_INDEX") || [];

  return (
    <Table
      fixed={!full}
      singleLine={!full}
      unstackable={unstackable}
      compact="very"
      style={{
        width: "100%",
        color: "white",
        background: "#00000099",
        fontSize: "clamp(0.8em, 1vw, 1em)",
      }}
    >
      {createHeader(showColumns)}
      {createBody(showColumns)}
      <ConfirmDeleteModal
        processDelete={processDelete}
        deleteIds={deleteIds}
        setDeleteIds={setDeleteIds}
      />
      <Table.Footer fullWidth>
        <Table.Row>
          <Table.HeaderCell
            colSpan={showColumns.length + 1}
            style={{ paddingTop: "0px", background: "white", paddingBottom: "2px" }}
          >
            {pages > 1 ? (
              <Pagination
                size="mini"
                boundaryRange={0}
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
                onPageChange={(e, d) => pageChange(d.activePage)}
              ></Pagination>
            ) : null}
          </Table.HeaderCell>
        </Table.Row>
      </Table.Footer>
    </Table>
  );
};

const PopupCell = ({ text }) => {
  return (
    <Popup
      hideOnScroll
      style={{ padding: "2px", boxShadow: "0px 0px 10px white" }}
      trigger={<span>{text}</span>}
    >
      <Popup.Content style={{ overflow: "auto", overflowWrap: "break-word", maxWidth: "150px" }}>
        {text}
      </Popup.Content>
    </Popup>
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

export default React.memo(DataTable);
