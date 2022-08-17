import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";
import React, { useEffect, useState } from "react";

const colors = ["#bc6e96", "#e2bc3f"];

const Lowlands = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    getData(setData);
  }, []);
  console.log(data);

  return (
    <div style={{ width: "100vw", height: "100vh", background: "#00000088", display: "flex" }}>
      <div style={{ margin: "auto" }}>
        <VegaWordcloud
          data={data?.wordcloud}
          selectedWord={null}
          setSelectedWord={(word) => {
            //const channels = categoryChannels?.[word];
            //console.log(channels);
          }}
          unclickable={true}
          colors={colors}
          rotate={undefined}
        />
      </div>
    </div>
  );
};

const getData = async (setData) => {
  try {
    const res = await fetch("http://localhost:5000/project/lowlands/publicdata");
    const data: Record<string, number>[] = await res.json();
    const table = {};
    for (const row of data) {
      let total: number = 0;
      for (const value of Object.values(row)) total += value;
      if (total === 0) continue;
      for (const key of Object.keys(row)) {
        console.log(row[key], total);
        if (!table[key]) table[key] = 0;
        table[key] += row[key] / total;
      }
    }
    const wordcloud = Object.keys(table).map((category) => ({
      text: category,
      visits: table[category],
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));
    setData({ n: data.length, wordcloud: { table: wordcloud } });
  } catch (e) {
    console.log(e);
  }
};

export default Lowlands;
