import React, { useState } from "react";
import { Grid, Header, Icon, List, Segment, Step } from "semantic-ui-react";
import ReactMarkdown from "react-markdown";

const default_image_style = {
  width: "100%",
  border: "1px solid grey",
  boxShadow: "0 1px 2px 0 grey",
  marginBottom: "15px",
};

export default function StepwiseInstructions({ instruction, icon }) {
  const [selected, setSelected] = useState(0);

  return (
    <Grid style={{ height: "100%" }}>
      <Grid.Row style={{ height: "30%", overflow: "auto" }}>
        <Grid.Column>
          <Header
            as="h1"
            textAlign="center"
            style={{ marginTop: "5px", color: "rgb(65, 131, 196)" }}
          >
            <Icon name={icon} />
            {instruction.title}
          </Header>
          <ReactMarkdown linkTarget={"_blank"}>{instruction.introduction}</ReactMarkdown>
        </Grid.Column>
      </Grid.Row>
      <Grid.Row style={{ height: "70%" }}>
        <Grid.Column width="5" style={{ height: "100%", overflow: "auto" }}>
          <div>
            <Step.Group vertical style={{ width: "calc(100% - 10px)" }}>
              {instruction.steps.map((step, i) => {
                return (
                  <Step key={step.title} active={i === selected} onClick={() => setSelected(i)}>
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
        <Grid.Column width="11" style={{ height: "100%", overflow: "auto" }}>
          <Segment>
            <List>
              {instruction.steps[selected].items.map((item, i) => {
                return (
                  <List.Item key={i}>
                    <List.Icon name="play" />
                    <List.Content>
                      <ReactMarkdown linkTarget={"_blank"}>{item.text}</ReactMarkdown>
                      {item.image ? (
                        <img
                          style={{ ...default_image_style, ...item.image_style }}
                          src={item.image}
                          alt="loading..."
                        />
                      ) : null}
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
