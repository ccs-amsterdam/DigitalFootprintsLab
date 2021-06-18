import { combineReducers } from "redux";

const platformStatus = (state = [], action) => {
  switch (action.type) {
    case "SET_PLATFORM_STATUS":
      // set whole status array
      return action.platformStatus;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  platformStatus,
});

export default rootReducer;
