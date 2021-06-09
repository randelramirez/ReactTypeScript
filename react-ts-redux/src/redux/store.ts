import { combineReducers, createStore } from "redux";
import userEventsReducer from "./user-events";

const rootReducer = combineReducers({
  userEvents: userEventsReducer,
});

// instead of creating an interface for root state, we can use ReturnType
// this any time there's a change in root reducer, we wouldn't need to add new properties on the interface
export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer);

export default store;
