const intersect = (arrays) => {
  // intersect for sorted arrays
  // (dexie doesn't do AND queries, so we search ids for different filters separately and intersect them)
  arrays = arrays.filter((array) => array !== null);
  if (arrays.length === 0) return null;

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
  for (let i = 1; i < arrays.length - 1; i++) {
    if (arrays[i][cursors[i]] !== arrays[0][cursors[0]]) return false;
  }
  return true;
};

const allMax = (arrays, cursors) => {
  let max = arrays[0][cursors[0]];
  for (let i = 1; i < arrays.length - 1; i++) {
    if (arrays[i][cursors[i]] > max) max = arrays[i][cursors[i]];
  }
  return max;
};

export default intersect;
