import { useEffect, useState, useRef } from "react";
import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";
import background from "../../images/lowlands_background.png";

import Electronic from "../../images/Electronic.png";
import Rock from "../../images/Rock.png";
import HipHop from "../../images/HipHop.png";
import Pop from "../../images/Pop.png";
import Key from "../../images/Key.png";

//import qr from "../../images/qrcode.png";

const images = {
  Rock: Rock,
  Hiphop: HipHop,
  Pop: Pop,
  Electronic: Electronic,
  "Classic & Jazz": Key,
};

//const colors_parent = ["white"];
const colors = ["#bc6e96", "#e2bc3f"];

const Lowlands = () => {
  const [data, setData] = useState(null);
  const modified = useRef(0);

  useEffect(() => {
    const interval = setInterval(() => getData(setData, modified), 5000);
    return () => clearInterval(interval);
  }, [setData, modified]);
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#00000088",
        display: "flex",
        position: "relative",
      }}
    >
      {/* <img
        style={{
          zIndex: 100,
          position: "absolute",
          bottom: "10px",
          left: "10px",
          height: "100px",
        }}
        alt="https://ccs-amsterdam.github.io/DigitalFootprintsLab"
        src={qr}
      /> */}
      <div
        style={{
          zIndex: 50,
          margin: "auto",
          position: "relative",
          width: "100%",
          height: "100%",
          maxWidth: "50vw",
        }}
      >
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
      <div
        style={{
          display: "flex",
          width: "50%",
          height: "100%",
          border: "2px solid white",
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: `100% 100%`,
        }}
      >
        <div
          style={{
            margin: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {["Rock", "Hiphop", "Pop", "Electronic", "Classic & Jazz"].map((genre) => {
            const pct = 100 * (data?.genrePct?.[genre] || 0);
            return (
              <div
                key={genre}
                style={{
                  flex: "1 1 auto",
                  marginBottom: "5%",
                  display: "flex",
                  alignItems: "center",
                  textAlign: "left",
                }}
              >
                <div style={{ width: "30%", margin: "auto 5% auto 5%" }}>
                  <div
                    style={{
                      width: "100%",
                      padding: "20px 10px 10px 10px",
                      background: `linear-gradient(to right, black ${pct}%, #000000aa ${pct}% 100%, #000000aa 100%)`,
                      borderRadius: "10px",
                      color: "white",
                      marginBottom: "2px",
                      textAlign: "center",
                    }}
                  >
                    <p>
                      <span style={{ fontSize: "1.2em", padding: "0px" }}>{genre}</span>
                      <br />
                      <span style={{ fontSize: "1em", fontStyle: "italic", lineHeight: "2em" }}>
                        {Math.round(pct)}%
                      </span>
                    </p>
                  </div>
                </div>
                <img
                  alt={genre}
                  style={{
                    border: "3px solid black",
                    width: "55%",
                  }}
                  src={images[genre]}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

const getData = async (setData, modified) => {
  try {
    const res = await fetch(
      `https://kasperwelbers.com/lowlands/project/lowlands/publicdata?updated=${modified.current}`
    );
    // const res = await fetch(
    //   `http://localhost:5000/project/lowlands/publicdata?updated=${modified.current}`
    // );

    const json = await res.json();
    modified.current = json.modified;
    if (!json.updated) return;

    const genres = json.data.map((j) => j.genre);
    const data: Record<string, any>[] = json.data.map((j) => j.categories);
    const table = {};
    const table_parent = {};
    for (const row of data) {
      let total: number = 0;
      for (const item of Object.values(row)) total += item.count;
      if (total === 0) continue;
      for (const key of Object.keys(row)) {
        if (row[key].parent !== "Music") continue;
        if (row[key].parent === "") {
          if (!table_parent[key]) table_parent[key] = 0;
          table_parent[key] += row[key].count / total;
        } else {
          if (!table[key]) table[key] = 0;
          table[key] += row[key].count / total;
        }
      }
    }

    const genrePct = {};
    for (const genre of genres) {
      if (!genrePct[genre]) genrePct[genre] = 0;
      genrePct[genre] += 1 / genres.length;
    }

    const wordcloud = Object.keys(table).map((category) => ({
      text: category,
      visits: table[category],
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));

    const wordcloud_parent = Object.keys(table_parent).map((category) => ({
      text: category,
      visits: table_parent[category],
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));

    setData({
      n: data.length,
      wordcloud: { table: wordcloud },
      wordcloud_parent: { table: wordcloud_parent },
      genrePct,
    });
  } catch (e) {
    console.log(e);
  }
};

export default Lowlands;
