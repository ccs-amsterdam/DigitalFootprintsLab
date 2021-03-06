import { combineReducers } from "redux";

const dataStatus = (state = [], action) => {
  switch (action.type) {
    case "SET_DATA_STATUS":
      // set whole status array
      return action.dataStatus;
    default:
      return state;
  }
};

const persistent = (state = true, action) => {
  switch (action.type) {
    case "SET_PERSISTENT":
      return action.persistent;
    default:
      return state;
  }
};

const smallScreen = (state = true, action) => {
  switch (action.type) {
    case "SET_SMALLSCREEN":
      return action.smallScreen;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  dataStatus,
  persistent,
  smallScreen,
});
export default rootReducer;
