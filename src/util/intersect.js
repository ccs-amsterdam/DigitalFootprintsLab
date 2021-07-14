const intersect = (arrays) => {
  // intersect ordered numbers across multiple arrays
  // arrays is an array of arrays, where each array has sorted (!!) table ids.
  // (dexie doesn't do AND queries, so we search ids for different filters separately and intersect them)
  arrays = arrays.filter((array) => array !== null);
  if (arrays.length === 0) return null;
  if (arrays.length === 1) return arrays[0];

  const cursors = new Array(arrays.length).fill(0);
  const res = [];

  while (!anyDone(arrays, cursors)) {
    if (allEqual(arrays, cursors)) {
      console.log(cursors[0]);
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
  console.log("-------------");
  for (let i = 0; i < arrays.length; i++) {
    console.log(arrays[i][cursors[i]]);
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
