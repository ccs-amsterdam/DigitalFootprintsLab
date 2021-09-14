import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useLiveQuery } from "dexie-react-hooks";
import { Button, Input } from "semantic-ui-react";
import db from "apis/dexie";

const propTypes = {
  /** The name of the table */
  table: PropTypes.string,
  /** An array with names of the (text) columns in the table that should be used for the fulltext search */
  searchOn: PropTypes.array,
  /** A callback function for returning the row IDs that match the query */
  setSelection: PropTypes.func,
  /** A callback function for setting the loading status */
  setLoading: PropTypes.func,
};

/**
 * Create an input for full text search
 */
const QueryInput = ({ table, searchOn, setSelection, setLoading }) => {
  const [search, setSearch] = useState("");
  const [selectionStatus, setSelectionStatus] = useState("none");

  const n = useLiveQuery(() => db.idb.table(table).count());

  useEffect(() => {
    setLoading(selectionStatus === "searching");
  }, [selectionStatus, setLoading]);

  useEffect(() => {
    const timer = setTimeout(() => {
      searchSelection(table, searchOn, search, setSelection, setSelectionStatus);
    }, 500);
    return () => clearTimeout(timer);
  }, [table, search, setSelectionStatus, searchOn, setSelection, n]);

  return (
    <Input
      fluid
      label="Search data"
      loading={selectionStatus === "searching"}
      value={search}
      icon={
        <Button
          compact
          icon="window close"
          onClick={() => setSearch("")}
          size="huge"
          style={{ color: "white", height: "1em", background: "#ffffff00" }}
        />
      }
      onChange={(e, d) => setSearch(d.value)}
    ></Input>
  );
};

const searchSelection = async (table, searchOn, search, setSelection, setSelectionStatus) => {
  if (search === "") {
    setSelection(null);
    setSelectionStatus("none");
    return;
  }
  setSelectionStatus("searching");

  const selection = await db.getSelectionQuery(table, searchOn, search);
  setSelection(selection);
  setSelectionStatus("finished");
};

QueryInput.propTypes = propTypes;
export default React.memo(QueryInput);

// just keeping this here so I wont forget how insanely usefull this is.
// A second argument to React.memo lets you view the prev and next props
// to see which bastard rerenders the living hell out of a component
// export default React.memo(QueryTable, (prevprops, nextprops) => {
//   console.log(prevprops);
//   console.log(nextprops);
//   console.log(prevprops.selection === nextprops.selection);
//   console.log(prevprops.setSelection === nextprops.setSelection);
//   console.log(prevprops.searchOn === nextprops.searchOn);
// });
