import db from "apis/db";
import { useEffect, useState } from "react";
import { Button, Grid, Segment } from "semantic-ui-react";
import youtubeCats from "data/youtube_categories.json";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";
import background from "../../images/lowlands_background.png";

const colors = ["#bc6e96", "#e2bc3f"];

const YoutubeCategories = ({ setStep, settings }) => {
  const [data, setData] = useState(null);

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
              background: "#00000099",
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
              Stuff you like
            </h1>
            <p style={{ fontSize: "1.4em" }}>
              Based on your Youtube viewing history we can get a rough sketch of your interests and
              musical tastes. We will keep track of the shared tastes of all participants on the big
              screen in the Digital Footprints Lab tent!
            </p>
            <YoutubeChannels data={data} setData={setData} />
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column
            width={14}
            style={{
              border: "1px solid black",
              background: "#00000099",
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
              Genre Wars
            </h1>
            <p style={{ fontSize: "1.4em" }}>
              Which of the following musical genres do you like best?
              <br />
              <span style={{ color: "#bc6e96", textShadow: "0px 0px white" }}>
                You can also get a (temporary) tattoo of these illustrations!
              </span>
            </p>
            <div
              style={{ display: "flex", flexDirection: "column", width: "100%", padding: "10px" }}
            >
              {["Rock", "Hiphop", "Classic", "Electronic"].map((genre) => {
                return (
                  <Button
                    style={{ flex: "1 1 auto", margin: "5px", background: "white" }}
                    key={genre}
                    onClick={() => onClick(genre)}
                  >
                    {genre}
                  </Button>
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
    await fetch("http://localhost:5000/project/lowlands/publicdata", requestOptions);
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
        if (!category) continue;
        if (!data[category]) data[category] = 0;
        data[category]++;
        // if (!categoryChannels[category]) categoryChannels[category] = {};
        // if (!categoryChannels[category][row.channel]) categoryChannels[category][row.channel] = 0;
        // categoryChannels[category][row.channel]++;
      }
    }

    const table = Object.keys(data).map((category) => ({
      text: category,
      visits: data[category],
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));
    setData(data);
    setTable({ table });
    //setCategoryChannels(categoryChannels);
  }, [dashData, setData]);

  if (!data) return null;

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
