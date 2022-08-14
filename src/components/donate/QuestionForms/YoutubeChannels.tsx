import { useEffect, useState } from "react";
import { Grid } from "semantic-ui-react";
import youtubeCats from "data/youtube_categories.json";
import useDashboardData from "components/explore/dashboardData/useDashboardData";
import VegaWordcloud from "components/explore/dashboards/dashboardParts/VegaWordcloud";

/**
 * This component really doesn't make sense as a 'questionform'
 * It's really just an ad-hoc way to add a visual for the Lowlands data collection
 * and should be removed after
 */

const YoutubeChannels = ({ question, setDone }) => {
  const [data, setData] = useState(null);
  const [categoryChannels, setCategoryChannels] = useState({});
  const dashData = useDashboardData("Youtube");

  useEffect(() => {
    setDone(true);
  }, [setDone]);

  useEffect(() => {
    if (!dashData) return null;
    const data = {};
    const categoryChannels = {};
    for (let row of dashData.data) {
      if (!row.channel_url) continue;
      const id = row.channel_url.split("/channel/")[1];
      const indices = youtubeCats.channel_categories?.[id] || [];
      for (let i of indices) {
        const category = youtubeCats.category_labels?.[i - 1];
        if (!category) continue;
        if (!data[category]) data[category] = 0;
        data[category]++;
        if (!categoryChannels[category]) categoryChannels[category] = {};
        if (!categoryChannels[category][row.channel]) categoryChannels[category][row.channel] = 0;
        categoryChannels[category][row.channel]++;
      }
    }

    const table = Object.keys(data).map((category) => ({
      text: category,
      visits: data[category],
      angle: [-45, 0, 45][~~(Math.random() * 3)],
    }));
    setData({ table });
    setCategoryChannels(categoryChannels);
  }, [dashData]);

  if (!data) return null;

  return (
    <>
      <Grid.Row>
        <Grid.Column
          width={16}
          style={{ background: "black", border: "1px solid grey", borderRadius: "10px" }}
        >
          <VegaWordcloud
            data={data}
            selectedWord={null}
            setSelectedWord={(word) => {
              const channels = categoryChannels?.[word];
              console.log(channels);
            }}
            unclickable={false}
            colors={undefined}
            rotate={undefined}
          />
        </Grid.Column>
      </Grid.Row>
    </>
  );
};

export default YoutubeChannels;
