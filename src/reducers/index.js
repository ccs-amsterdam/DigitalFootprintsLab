import { combineReducers } from "redux";

const db = (state = null, action) => {
  switch (action.type) {
    case "SET_DB":
      return action.payload;
    case "RESET_DB":
      return null;
    default:
      return state;
  }
};

const rootReducer = combineReducers({
  db,
});

export default rootReducer;
