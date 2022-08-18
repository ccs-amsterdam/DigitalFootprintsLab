import db from "apis/db";
import { useEffect, useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import youtubeCats from "data/youtube_categories.json";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";
import background from "../../images/lowlands_background.png";
import { useTranslation } from "react-i18next";

import Electronic from "../../images/Electronic.png";
import Rock from "../../images/Rock.png";
import HipHop from "../../images/HipHop.png";
import Pop from "../../images/Pop.png";
import Key from "../../images/Key.png";

const images = {
  Rock: Rock,
  Hiphop: HipHop,
  Pop: Pop,
  Electronic: Electronic,
  "Classic & Jazz": Key,
};

const colors = ["#bc6e96", "#e2bc3f"];

const YoutubeCategories = ({ setStep, settings }) => {
  const [data, setData] = useState(null);
  const { t } = useTranslation();

  const onClick = (genre) => {
    console.log(genre);
    submitData({ genre, categories: data });
    setStep(4);
  };

  return (
    <Segment
      style={{
        background: "white",
        height: "100%",
        width: "100%",
        color: "black",
        minHeight: "300px",
        overflow: "auto",
      }}
    >
      <Grid
        centered
        verticalAlign="top"
        style={{
          minHeight: "100%",
          backgroundImage: background ? `url(${background})` : "none",
          backgroundSize: `100% 100%`,
          //height: "800px",
        }}
      >
        <Grid.Row>
          <Grid.Column
            width={14}
            style={{
              border: "1px solid black",
              background: "#000000aa",
              backdropFilter: "blur(3px)",
              borderRadius: "5px",
              marginTop: "30px",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "1px 1px #bc6e96",
            }}
          >
            <h1
              style={{
                width: "100%",
                fontSize: "3em",
              }}
            >
              {t("lowlands.h1")}
            </h1>
            <p style={{ fontSize: "1.4em", paddingBottom: "0" }}>{t("lowlands.p1")}</p>
            <YoutubeChannels data={data} setData={setData} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column
            width={14}
            style={{
              border: "1px solid black",
              background: "#000000aa",
              backdropFilter: "blur(3px)",
              borderRadius: "5px",
              marginTop: "30px",
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              textShadow: "1px 1px #bc6e96",
            }}
          >
            <h1
              style={{
                width: "100%",
                fontSize: "3em",
              }}
            >
              {t("lowlands.h2")}
            </h1>
            <p style={{ fontSize: "1.4em" }}>
              {t("lowlands.p2")}

              <br />
              {/* <span style={{ color: "#bc6e96", textShadow: "0px 0px white" }}>
                {t("lowlands.p3")}
              </span> */}
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", width: "100%", padding: "10px" }}
            >
              {["Rock", "Hiphop", "Pop", "Electronic", "Classic & Jazz"].map((genre) => {
                return (
                  <div
                    key={genre}
                    style={{ flex: "1 1 auto", marginBottom: "6px", cursor: "pointer" }}
                    onClick={() => onClick(genre)}
                  >
                    <h3 style={{ marginBottom: "2px" }}>{genre}</h3>
                    <img
                      alt={genre}
                      style={{
                        width: "80%",
                        maxWidth: "400px",
                        height: "100px",
                      }}
                      src={images[genre]}
                    />
                  </div>
                );
              })}
            </div>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14} style={{ marginBottom: "50px" }}></Grid.Column>
        </Grid.Row>
      </Grid>
    </Segment>
  );
};

const submitData = async (data) => {
  const meta = await db.idb.meta.get(1);
  const body = { submission_id: meta.userId, data };

  const requestOptions: RequestInit = {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  };

  try {
    await fetch("https://kasperwelbers.com/lowlands/project/lowlands/publicdata", requestOptions);
    //await fetch("http://localhost:5000/project/lowlands/publicdata", requestOptions);
  } catch (e) {
    console.log(e);
  }
};

const YoutubeChannels = ({ data, setData }) => {
  //const [categoryChannels, setCategoryChannels] = useState({});
  const [table, setTable] = useState(null);
  const dashData = useDashboardData("Youtube");

  useEffect(() => {
    if (!dashData) return null;
    console.log(dashData);
    console.log(youtubeCats);
    const data = {};
    //const categoryChannels = {};

    for (let row of dashData.data) {
      if (!row.channel_url) continue;
      const id = row.channel_url.split("/channel/")[1];
      const indices = youtubeCats.channel_categories?.[id] || [];
      for (let i of indices) {
        const category = youtubeCats.category_labels?.[i - 1];
        if (!category?.parent) continue;
        if (!data[category?.category])
          data[category.category] = { parent: category?.parent, count: 0 };
        data[category?.category].count++;
        // if (!categoryChannels[category]) categoryChannels[category] = {};
        // if (!categoryChannels[category][row.channel]) categoryChannels[category][row.channel] = 0;
        // categoryChannels[category][row.channel]++;
      }
    }

    const table = Object.keys(data).map((category) => ({
      text: category,
      visits: data[category].count,
      parent: data[category].parent,
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));
    setData(data);
    setTable({ table });
    //setCategoryChannels(categoryChannels);
  }, [dashData, setData]);

  if (!table) return null;

  return (
    <VegaWordcloud
      data={table}
      selectedWord={null}
      setSelectedWord={(word) => {
        //const channels = categoryChannels?.[word];
        //console.log(channels);
      }}
      unclickable={true}
      colors={colors}
      rotate={undefined}
    />
  );
};

export default YoutubeCategories;
