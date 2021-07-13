import React, { useEffect, useState } from "react";
import { Input } from "semantic-ui-react";
import db from "../apis/dexie";

const QueryTable = ({ table, searchOn, setSelection }) => {
  // table: what table in db
  // searchOn: what columns to search in
  // setSelection: parent hook

  const [search, setSearch] = useState("");
  const [selectionStatus, setSelectionStatus] = useState("none");

  useEffect(() => {
    const timer = setTimeout(() => {
      searchSelection(table, searchOn, search, setSelection, setSelectionStatus);
    }, 500);
    return () => clearTimeout(timer);
  }, [table, search, setSelectionStatus, searchOn, setSelection]);

  return (
    <Input
      loading={selectionStatus === "searching"}
      value={search}
      icon="search"
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

  const selection = await db.getSelection(table, searchOn, search);
  setSelection(selection);
  setSelectionStatus("finished");
};

export default React.memo(QueryTable);

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
