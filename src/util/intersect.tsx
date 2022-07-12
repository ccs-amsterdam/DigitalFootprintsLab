/**
 * Intersect ordered numbers across multiple arrays.
 * Used in this app to quickly intersect the table row ids from different filters (e.g., text query, date, key)
 *
 * @param {array} arrays an array of arrays, where each array has sorted (!!!) integers
 * @returns An array of integers
 */
const intersect = (arrays) => {
  arrays = arrays.filter((array) => array !== null);
  if (arrays.length === 0) return null;
  if (arrays.length === 1) return arrays[0];

  const cursors = new Array(arrays.length).fill(0);
  const res = [];

  while (!anyDone(arrays, cursors)) {
    if (allEqual(arrays, cursors)) {
      res.push(arrays[0][cursors[0]]);
      for (let i = 0; i < cursors.length; i++) cursors[i]++;
    }
    const max = allMax(arrays, cursors);
    for (let i = 0; i < cursors.length; i++) {
      if (arrays[i][cursors[i]] < max) cursors[i]++;
    }
  }
  return res;
};

const anyDone = (arrays, cursors) => {
  for (let i = 0; i < arrays.length; i++) {
    if (arrays[i].length <= cursors[i]) return true;
  }
  return false;
};

const allEqual = (arrays, cursors) => {
  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i][cursors[i]] !== arrays[0][cursors[0]]) return false;
  }
  return true;
};

const allMax = (arrays, cursors) => {
  let max = arrays[0][cursors[0]];
  for (let i = 1; i < arrays.length; i++) {
    if (arrays[i][cursors[i]] > max) max = arrays[i][cursors[i]];
  }
  return max;
};

export default intersect;
