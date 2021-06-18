import React from "react";
import { Grid } from "semantic-ui-react";

const ColoredBackgroundGrid = ({ children, background, color }) => {
  // create a Grid with a background that has a color on top of it
  // this can be used with a transparent color to for instance darken a background

  return (
    <>
      <div
        style={{
          zIndex: 1,
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          background: color,
          position: "absolute",
        }}
      />
      <Grid
        style={{
          height: "100vh",
          overflow: "auto",
          backgroundSize: "100% 100%",

          backgroundImage: `url(${background})`,
        }}
      >
        <div style={{ zIndex: 2 }}>{children}</div>
      </Grid>
    </>
  );
};

export default ColoredBackgroundGrid;
