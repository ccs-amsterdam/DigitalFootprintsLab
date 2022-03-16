import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Button, Input, Icon, Loader } from "semantic-ui-react";

const propTypes = {
  /** The name of the table */
  table: PropTypes.string,
  /** An array with names of the (text) columns in the table that should be used for the fulltext search */
  searchOn: PropTypes.array,
  /** A callback function for returning the row IDs that match the query */
  setSelection: PropTypes.func,
};

/**
 * Create an input for full text search
 */
const QueryInput = ({ dashData, searchOn, setSelection, iconColor = "white" }) => {
  const [search, setSearch] = useState("");
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    setSearching(true);
    const timer = setTimeout(() => {
      if (dashData && search) {
        setSelection(dashData.search(search, searchOn));
      } else {
        setSelection(null);
      }
      setSearching(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [dashData, search, searchOn, setSearching, setSelection]);

  return (
    <div style={{ display: "flex", margin: "0" }}>
      <div className="dimmable" style={{ width: "50px" }}>
        <Loader active={searching} />
        <Icon
          size="big"
          name={searching ? null : "search"}
          style={{ paddingTop: "9px", paddingLeft: "10px", color: iconColor }}
        />
      </div>
      <div style={{ flex: "1 1 auto" }}>
        <Input
          fluid
          value={search}
          icon={
            <Button
              compact
              icon="window close"
              onClick={() => setSearch("")}
              size="huge"
              style={{ color: iconColor, height: "1em", background: "#ffffff00" }}
            />
          }
          onChange={(e, d) => setSearch(d.value)}
        ></Input>
      </div>
    </div>
  );
};

QueryInput.propTypes = propTypes;
export default React.memo(QueryInput);
