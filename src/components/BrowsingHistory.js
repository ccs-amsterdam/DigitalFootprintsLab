import React from "react";
import { useSelector } from "react-redux";
import ReactWordcloud from "react-wordcloud";

const BrowsingHistory = () => {
  const data = useSelector((state) => state.browserHistoryData);

  if (!data.domainTotal || data.domainTotal.length === 0) return null;

  return (
    <div className="wordcloud">
      <ReactWordcloud
        words={data.domainTotal}
        options={{
          rotations: 0,
          padding: 0.5,
          fontSizes: [10, 100],
          deterministic: true,
          transitionDuration: 500,
          colors: ["white"],
        }}
      />
    </div>
  );
};

export default BrowsingHistory;
