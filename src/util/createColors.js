import Rainbow from "rainbowvis.js";

const createColors = (n, color1, color2, color3) => {
  var heatmap = new Rainbow();
  heatmap.setSpectrum(color1, color2, color3);
  heatmap.setNumberRange(0, n);
  const colors = [];
  for (let i = 0; i <= n; i++) colors.push("#" + heatmap.colourAt(i));
  return colors;
};

export default createColors;
