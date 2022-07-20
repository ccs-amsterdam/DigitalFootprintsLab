export const setDataStatus = (dataStatus) => {
  return {
    type: "SET_DATA_STATUS",
    dataStatus,
  };
};

export const setPersistent = (persistent) => {
  return {
    type: "SET_PERSISTENT",
    persistent,
  };
};

export const setSmallScreen = (smallScreen) => {
  return {
    type: "SET_SMALLSCREEN",
    smallScreen,
  };
};
