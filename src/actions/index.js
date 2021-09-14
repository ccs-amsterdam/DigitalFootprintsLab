export const setDataStatus = (dataStatus) => {
  return {
    type: "SET_DATA_STATUS",
    dataStatus,
  };
};

export const updateDataStatus = (name, status) => {
  return (dispatch, getState) => {
    const { dataStatus } = getState();
    const newDataStatus = [...dataStatus];
    const i = newDataStatus.findIndex((data) => data.name === name);
    if (i < 0) {
      newDataStatus.push({ name, date: null, status: status });
    } else {
      newDataStatus[i] = { ...newDataStatus[i], status: status };
    }
    dispatch(setDataStatus(newDataStatus));
  };
};
