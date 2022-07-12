import Rainbow from "rainbowvis.js";

/**
 * Create a gradient from color 1 to 2 to 3 in n steps
 * @param {number} n        The number of steps
 * @param {string} color1   Starting color
 * @param {string} color2   Mid color
 * @param {string} color3   Ending color
 * @returns An array of n colors
 */
const createColors = (n, color1, color2, color3) => {
  var heatmap = new Rainbow();
  heatmap.setSpectrum(color1, color2, color3);
  heatmap.setNumberRange(0, n);
  const colors = [];
  for (let i = 0; i <= n; i++) colors.push("#" + heatmap.colourAt(i));
  return colors;
};

export default createColors;
