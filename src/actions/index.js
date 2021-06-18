export const setPlatformStatus = (platformStatus) => {
  return {
    type: "SET_PLATFORM_STATUS",
    platformStatus,
  };
};

export const updatePlatformStatus = (name, status) => {
  return (dispatch, getState) => {
    const { platformStatus } = getState();
    const newPlatformStatus = [...platformStatus];
    const i = newPlatformStatus.findIndex((platform) => platform.name === name);
    if (i < 0) {
      newPlatformStatus.push({ name, date: null, status: status });
    } else {
      newPlatformStatus[i] = { ...newPlatformStatus[i], status: status };
    }
    dispatch(setPlatformStatus(newPlatformStatus));
  };
};
