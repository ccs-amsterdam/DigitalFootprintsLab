import db from "apis/db";
import { useEffect, useState } from "react";
import { Grid, Segment } from "semantic-ui-react";
import youtubeCats from "data/youtube_categories.json";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";
import background from "../../images/lowlands_background.png";

const colors = ["#bc6e96", "#e2bc3f"];

const YoutubeCategories = ({ settings }) => {
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
              background: "#ffffff77",
              borderRadius: "5px",
              marginTop: "30px",
              color: "black",
              backdropFilter: "blur(3px)",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <h1
              style={{
                textShadow: "2px 2px white",
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
          </Grid.Column>
        </Grid.Row>
        <YoutubeChannels />
        <Grid.Row>
          <Grid.Column
            width={14}
            style={{
              border: "1px solid black",
              background: "#ffffff77",
              borderRadius: "5px",
              marginTop: "30px",
              color: "black",
              backdropFilter: "blur(3px)",
              textAlign: "center",
              fontWeight: "bold",
            }}
          >
            <h1
              style={{
                textShadow: "2px 2px white",
                width: "100%",
                fontSize: "3em",
              }}
            >
              Genre Wars
            </h1>
            <p style={{ fontSize: "1.4em" }}>
              Which of the following musical genres do you like best?
              <br />
              <span style={{ color: "purple" }}>
                You can also get a (temporary) tattoo of these illustrations!
              </span>
            </p>
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

const YoutubeChannels = () => {
  const [data, setData] = useState(null);
  //const [categoryChannels, setCategoryChannels] = useState({});
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
    setData({ table });
    //setCategoryChannels(categoryChannels);
    submitData(data);
  }, [dashData]);

  if (!data) return null;
  console.log(data);

  return (
    <>
      <Grid.Row>
        <Grid.Column
          width={14}
          style={{
            border: "",
            background: "#00000099",
            backdropFilter: "blur(3px)",
            //border: "1px solid grey",
            borderRadius: "10px",
            paddingTop: "0px",
            height: "300px",
          }}
        >
          <VegaWordcloud
            data={data}
            selectedWord={null}
            setSelectedWord={(word) => {
              //const channels = categoryChannels?.[word];
              //console.log(channels);
            }}
            unclickable={true}
            colors={colors}
            rotate={undefined}
          />
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

export default YoutubeCategories;
