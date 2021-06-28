import { RootState } from "./store";
import { Action } from "redux";

interface RecordState {
  dateStart: string;
}

const START = "recorder/start";
const STOP = "recorder/stop";

type StartAction = Action<typeof START>;
type StopAction = Action<typeof STOP>;

// Action Creator
export const start = (): StartAction => ({ type: START });

// Action Creator
export const stop = (): StopAction => ({ type: STOP });

// selector
export const selectRecorderState = (rootState: RootState) => rootState.recorder;

// selector
export const selectDateStart = (rootState: RootState) =>
  selectRecorderState(rootState).dateStart;

const initialState: RecordState = {
  dateStart: "",
};

const recorderReducer = (
  state: RecordState = initialState,
  action: StartAction | StopAction
) => {
  switch (action.type) {
    case START:
      return { ...state, dateStart: new Date().toISOString() };
    case STOP:
      return { ...state, dateStart: "" };
    default:
      return state;
  }
};

export default recorderReducer;
