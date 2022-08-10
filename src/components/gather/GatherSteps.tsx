import { useState } from "react";
import { Grid, Header, Icon, List, Button } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";
import ImportData from "./ImportData";
import useSwipe from "util/useSwipe";

const default_image_style = {
  width: "100%",
  border: "1px solid grey",
  boxShadow: "0 1px 2px 0 grey",
  marginBottom: "15px",
};

export default function GatherSteps({ t, platform, instruction }) {
  // selected is an index for instruction.steps + 1.
  // if selected == instruction.steps.length (so the item after the last step),
  // the import step is shown
  const [selected, setSelected] = useState(0);

  useSwipe((direction) => {
    if (direction === "right" && selected > 0) setSelected(selected - 1);
    if (direction === "left" && selected < (instruction?.steps?.length || 0))
      setSelected(selected + 1);
  });

  const Prev = () => {
    const active = selected > 0;
    return (
      <Icon
        size="huge"
        name={"chevron left"}
        onClick={() => {
          if (active) setSelected(selected - 1);
        }}
        style={active ? { cursor: "pointer", color: "#1678c2" } : { color: "white" }}
      />
    );
  };

  const Next = ({ asButton = false }) => {
    const active = selected < instruction.steps.length;
    if (asButton)
      return (
        <Button
          style={active ? {} : { display: "none" }}
          onClick={() => {
            if (selected < instruction.steps.length) setSelected(selected + 1);
          }}
        >
          {t("gather.importdata.next")}
        </Button>
      );
    return (
      <Icon
        size="huge"
        name={"chevron right"}
        onClick={() => {
          if (active) setSelected(selected + 1);
        }}
        style={active ? { cursor: "pointer", color: "#1678c2" } : { color: "white" }}
      />
    );
  };

  const Pagination = () => {
    const steps = [...Array(instruction.steps.length + 1).keys()];

    return (
      <Button.Group style={{ paddingTop: "11px" }}>
        {steps.map((step) => {
          const active = step === selected;
          const color = active ? "white" : null;
          const background = active ? "rgb(22, 120, 194)" : null;

          return (
            <Button
              circular
              style={{ borderRadius: "50%", color, background }}
              onClick={() => setSelected(step)}
              compact
            >
              {step + 1}
            </Button>
          );
        })}
      </Button.Group>
    );
  };

  const InstructionStep = () => {
    if (selected < instruction.steps.length)
      return (
        <List>
          {instruction.steps?.[selected]?.items?.map((item, i) => {
            return (
              <List.Item key={i}>
                <List.Icon size="large" name="caret right" />
                <List.Content>
                  <ReactMarkdown linkTarget={"_blank"}>{item.text}</ReactMarkdown>
                  {renderImages(item.image, item.image_style)}
                </List.Content>
              </List.Item>
            );
          })}
        </List>
      );
    return <ImportData t={t} platform={platform} instruction={instruction} />;
  };

  const title =
    selected < instruction.steps.length ? instruction.steps[selected].title : "Import your data";

  return (
    <Grid centered>
      <Grid.Row style={{ color: "black", background: "white", borderRadius: "10px" }}>
        <Grid.Column textAlign="center" style={{ maxWidth: "600px" }}>
          <Header>
            {platform.icon ? (
              <Icon
                size="huge"
                name={platform.icon}
                style={{ width: "66px", height: "55px", color: "#4183c4" }}
              />
            ) : (
              <img src={platform.img} alt={"logo"} style={{ width: "66px", height: "55px" }} />
            )}
            {instruction.title}
          </Header>
          <ReactMarkdown linkTarget={"_blank"}>{instruction.introduction}</ReactMarkdown>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ paddingBottom: "0px" }}>
        <Grid.Column textAlign="center">
          <h3 style={{ marginBottom: "2px" }}></h3>
          <div style={{ display: "flex", width: "100%", justifyContent: "center" }}>
            <Prev />
            <div style={{ minWidth: "200px" }}>
              <Pagination />
            </div>
            <Next />
          </div>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width="16" style={{ maxWidth: "600px" }}>
          {/* <h2 style={{ color: "#1678c2", textAlign: "center" }}>
            {t("gather.importdata.step")} {selected + 1}
          </h2> */}
          <h3 style={{ color: "#1678c2", textAlign: "center" }}>{title}</h3>
          <InstructionStep />
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Next asButton />
      </Grid.Row>
    </Grid>
  );
}

const renderImages = (image, style) => {
  if (!image) return null;
  const images = !Array.isArray(image) ? [image] : image;
  const image_style = style || {};
  return images.map((image) => {
    return (
      <img
        key={image}
        style={{ ...default_image_style, ...image_style }}
        src={image}
        alt="loading..."
      />
    );
  });
};
