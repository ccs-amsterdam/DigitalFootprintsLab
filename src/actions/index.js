export const setDataStatus = (dataStatus) => {
  return {
    type: "SET_DATA_STATUS",
    dataStatus,
  };
};

export const updateDataStatus = (name, dataName, source, status) => {
  return (dispatch, getState) => {
    const { dataStatus } = getState();
    const newDataStatus = [...dataStatus];

    const i = newDataStatus.findIndex((data) => data.name === name && data.source === source);
    if (i < 0) {
      const date = status === "finished" ? new Date() : null;
      newDataStatus.push({ name, dataName, source, date, status: status });
    } else {
      newDataStatus[i] = { ...newDataStatus[i], status: status };
      if (status === "finished") newDataStatus[i].date = new Date();
    }
    dispatch(setDataStatus(newDataStatus));
  };
};

export const setPersistent = (persistent) => {
  return {
    type: "SET_PERSISTENT",
    persistent,
  };
};
