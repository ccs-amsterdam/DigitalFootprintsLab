export const setDataStatus = (dataStatus) => {
  return {
    type: "SET_DATA_STATUS",
    dataStatus,
  };
};

export const updateDataStatus = (name, source, status) => {
  const date = status === "finished" ? new Date() : null;

  return (dispatch, getState) => {
    const { dataStatus } = getState();
    const newDataStatus = [...dataStatus];
    const i = newDataStatus.findIndex((data) => data.name === name && data.source === source);
    if (i < 0) {
      newDataStatus.push({ name, source, date, status: status });
    } else {
      newDataStatus[i] = { ...newDataStatus[i], status: status };
      if (date) newDataStatus[i].date = date;
    }
    dispatch(setDataStatus(newDataStatus));
  };
};
