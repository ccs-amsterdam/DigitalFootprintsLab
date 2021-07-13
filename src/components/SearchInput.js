import React, { useEffect, useState } from "react";
import { Search } from "semantic-ui-react";

const resultRenderer = option => (
  <div key="content" className="content">
    <div className="title">{option.value}</div>
  </div>
);

const SearchInput = ({ options, value, setValue }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const timeoutRef = React.useRef();
  const handleSearchChange = React.useCallback((e, data, options) => {
    clearTimeout(timeoutRef.current);
    setLoading(true);
    setValue(data.value);

    timeoutRef.current = setTimeout(() => {
      if (data.value.length === 0) {
        setLoading(false);
        setResults(false);
        return;
      }

      const re = new RegExp(data.value.replace(/[-/\\^$*+?.()|[\]{}]/g, "\\$&"), "i");
      const isMatch = options => re.test(options.value);

      setLoading(false);
      setResults(options.filter(isMatch));
    }, 200);
  }, []);

  return (
    <Search
      showNoResults={false}
      loading={loading}
      onResultSelect={(e, d) => {
        setValue(d.result.code);
      }}
      onSearchChange={(e, d) => {
        handleSearchChange(e, d, options);
      }}
      resultRenderer={resultRenderer}
      results={results}
      value={value}
      selectFirstResult={true}
    />
  );
};

export default SearchInput;
