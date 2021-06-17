import { combineReducers } from "redux";

const browserHistoryData = (state = {}, action) => {
  switch (action.type) {
    case "SET_BROWSER_HISTORY_DATA":
      return action.data;
    default:
      return state;
  }
};

const platformStatus = (state = [], action) => {
  switch (action.type) {
    case "SET_PLATFORM_STATUS":
      // set whole status array
      return action.platformStatus;
    case "UPDATE_PLATFORM_STATUS":
      // update single status
      return updatePlatformStatus([...state], action.name, action.status);
    default:
      return state;
  }
};

const updatePlatformStatus = (platformStatus, name, status) => {
  console.log(platformStatus);
  const i = platformStatus.findIndex((platform) => platform.name === name);
  if (i < 0) {
    platformStatus.push({ name, date: null, status: status });
  } else {
    platformStatus[i] = { ...platformStatus[i], status: status };
  }
  return platformStatus;
};

const rootReducer = combineReducers({
  browserHistoryData,
  platformStatus,
});

export default rootReducer;
