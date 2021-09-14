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

const rootReducer = combineReducers({
  dataStatus,
});

export default rootReducer;
