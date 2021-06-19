import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import recorderReducer from "./recorder";
import userEventsReducer from "./user-events";

const rootReducer = combineReducers({
  userEvents: userEventsReducer,
  recorder: recorderReducer,
});

// instead of creating an interface for root state, we can use ReturnType
// this any time there's a change in root reducer, we wouldn't need to add new properties on the interface
export type RootState = ReturnType<typeof rootReducer>;

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
