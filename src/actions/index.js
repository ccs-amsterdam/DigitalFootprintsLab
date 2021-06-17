export const resetDB = () => {
  return {
    type: "RESET_DB",
  };
};

export const setBrowserHistoryData = (data) => {
  return {
    type: "SET_BROWSER_HISTORY_DATA",
    data,
  };
};

export const setPlatformStatus = (platformStatus) => {
  return {
    type: "SET_PLATFORM_STATUS",
    platformStatus,
  };
};

export const updatePlatformStatus = (name, status) => {
  return {
    type: "UPDATE_PLATFORM_STATUS",
    name,
    status,
  };
};
