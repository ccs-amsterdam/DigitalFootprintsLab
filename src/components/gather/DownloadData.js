import React, { useState } from "react";
import { Grid, Header, Icon, List, Segment, Step } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

const default_image_style = {
  width: "100%",
  border: "1px solid grey",
  boxShadow: "0 1px 2px 0 grey",
  marginBottom: "15px",
};

export default function DownloadData({ t, instruction, icon }) {
  const [selected, setSelected] = useState(0);

  return (
    <Grid>
      <Grid.Row style={{ color: "black", background: "white", borderRadius: "10px" }}>
        <Grid.Column>
          <Header as="h1" textAlign="center" style={{ color: "rgb(65, 131, 196)" }}>
            {t("gather.download.header", "First download your data")}
            <br />
          </Header>
          <Header textAlign="center">
            <Icon name={icon} size="small" />
            {instruction.title}
          </Header>
          <ReactMarkdown linkTarget={"_blank"}>{instruction.introduction}</ReactMarkdown>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row>
        <Grid.Column width="5">
          <div>
            <Step.Group vertical>
              {instruction.steps.map((step, i) => {
                return (
                  <Step
                    key={step.title}
                    active={i === selected}
                    onClick={() => setSelected(i)}
                    style={{ padding: "5%" }}
                  >
                    <Step.Content>
                      <Step.Title>{step.title}</Step.Title>
                      <Step.Description>{step.description}</Step.Description>
                    </Step.Content>
                  </Step>
                );
              })}
            </Step.Group>
          </div>
        </Grid.Column>
        <Grid.Column width="11">
          <Segment>
            <List>
              {instruction.steps[selected].items.map((item, i) => {
                return (
                  <List.Item key={i}>
                    <List.Icon name="play" />
                    <List.Content>
                      <ReactMarkdown linkTarget={"_blank"}>{item.text}</ReactMarkdown>
                      {renderImages(item.image, item.image_style)}
                    </List.Content>
                  </List.Item>
                );
              })}
            </List>
          </Segment>
        </Grid.Column>
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
