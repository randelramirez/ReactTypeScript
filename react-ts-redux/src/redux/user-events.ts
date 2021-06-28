import { selectDateStart } from "./recorder";
import { RootState } from "./store";
import { Action } from "redux";
import { ThunkAction } from "redux-thunk";

export interface UserEvent {
  id: number;
  title: string;
  dateStart: string;
  dateEnd: string;
}

interface UserEventsState {
  byIds: Record<UserEvent["id"], UserEvent>;
  allIds: UserEvent["id"][];
}

const LOAD_REQUEST = "userEvents/load_request";
const LOAD_SUCCESS = "userEvents/load_sucess";
const LOAD_FAIL = "userEvents/load_fail";

interface LoadRequestAction extends Action<typeof LOAD_REQUEST> {}
interface LoadSuccessAction extends Action<typeof LOAD_SUCCESS> {
  payload: { events: UserEvent[] };
}
interface LoadFailAction extends Action<typeof LOAD_FAIL> {
  error: string;
}

const CREATE_REQUEST = "userEvents/create_request";
const CREATE_SUCCESS = "userEvents/create_success";
const CREATE_FAILURE = "userEvents/create_failure";
interface CreateRequestAction extends Action<typeof CREATE_REQUEST> {}
interface CreateSuccessAction extends Action<typeof CREATE_SUCCESS> {
  payload: { event: UserEvent };
}
interface CreateFailureAction extends Action<typeof CREATE_FAILURE> {
  error: string;
}

const UPDATE_REQUEST = "userEvents/update_request";
const UPDATE_SUCCESS = "userEvents/update_success";
const UPDATE_FAILURE = "userEvents/update_failure";
interface UpdateRequestAction extends Action<typeof UPDATE_REQUEST> {}
interface UpdateSuccessAction extends Action<typeof UPDATE_SUCCESS> {
  payload: { event: UserEvent };
}
interface UpdateFailureAction extends Action<typeof UPDATE_FAILURE> {
  error: string;
}

const DELETE_REQUEST = "userEvents/delete_request";
const DELETE_SUCCESS = "userEvents/delete_success";
const DELETE_FAILURE = "userEvents/delete_failure";
interface DeleteRequestAction extends Action<typeof DELETE_REQUEST> {}
interface DeleteSuccessAction extends Action<typeof DELETE_SUCCESS> {
  payload: { id: number };
}
interface DeleteFailureAction extends Action<typeof DELETE_FAILURE> {
  error: string;
}

// The action types provided in the Generic Type argument represents what action can be dispatch inside of that action
export const loadUserEvents =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    LoadRequestAction | LoadSuccessAction | LoadFailAction
  > =>
  async (dispatch, getState) => {
    dispatch({ type: LOAD_REQUEST });
    try {
      const response = await fetch("http://localhost:3001/events");
      const events: UserEvent[] = await response.json();
      dispatch({ type: LOAD_SUCCESS, payload: { events } });
    } catch (error) {
      dispatch({ type: LOAD_FAIL, error: "failed to load events" });
    }
  };

// Action Creator
// The action types provided in the Generic Type argument represents what action can be dispatch inside of that action
export const createUserEvent =
  (): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    CreateRequestAction | CreateSuccessAction | CreateFailureAction
  > =>
  async (dispatch, getState) => {
    dispatch({ type: CREATE_REQUEST });
    try {
      const dateStart = selectDateStart(getState());
      console.log("dateStart", dateStart);
      const event: Omit<UserEvent, "id"> = {
        title: "no name",
        dateStart,
        dateEnd: new Date().toISOString(),
      };

      const response = await fetch("http://localhost:3001/events", {
        method: "Post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      const createdEvent: UserEvent = await response.json();
      dispatch({ type: CREATE_SUCCESS, payload: { event: createdEvent } });
    } catch (error) {
      dispatch({ type: CREATE_FAILURE, error: "failed to create new event" });
    }
  };

// Action Creator
export const deleteUserEvent =
  (
    id: UserEvent["id"]
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    DeleteRequestAction | DeleteSuccessAction | DeleteFailureAction
  > =>
  async (dispatch, getState) => {
    try {
      dispatch({ type: DELETE_REQUEST });
      const response = await fetch(`http://localhost:3001/events/${id}`);
      if (response.ok) {
        dispatch({ type: DELETE_SUCCESS, payload: { id } });
      }
    } catch (error) {
      dispatch({ type: DELETE_FAILURE, error: "failed to delete event" });
    }
  };

// Action Creator
export const updateUserEvent =
  (
    event: UserEvent
  ): ThunkAction<
    Promise<void>,
    RootState,
    undefined,
    UpdateRequestAction | UpdateSuccessAction | UpdateFailureAction
  > =>
  async (dispatch, getState) => {
    dispatch({ type: UPDATE_REQUEST });
    try {
      const response = await fetch(`http://localhost:3001/events/${event.id}`, {
        method: "Put",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(event),
      });

      const updatedEvent: UserEvent = await response.json();
      dispatch({ type: UPDATE_SUCCESS, payload: { event: updatedEvent } });
    } catch (error) {
      dispatch({ type: UPDATE_FAILURE, error: error });
    }
  };

// Selector
const selectUserEventsState = (rootState: RootState) => rootState.userEvents;

// Selector
export const selectUserEvents = (rootState: RootState) => {
  const state = selectUserEventsState(rootState);
  return state.allIds.map((id) => state.byIds[id]);
};

const initialState: UserEventsState = {
  byIds: {},
  allIds: [],
};

const userEventsReducer = (
  state: UserEventsState = initialState,
  action:
    | LoadSuccessAction
    | CreateSuccessAction
    | DeleteSuccessAction
    | UpdateSuccessAction
): UserEventsState => {
  switch (action.type) {
    case LOAD_SUCCESS:
      const { events } = action.payload;
      return {
        ...state,
        allIds: events.map(({ id }) => id),
        byIds: events.reduce<UserEventsState["byIds"]>((byIds, event) => {
          // we create an object with the IDs as keys and value as the actual event
          byIds[event.id] = event;
          return byIds;
        }, {}),
      };
    case CREATE_SUCCESS:
      const { event } = action.payload;

      return {
        ...state,
        allIds: [...state.allIds, event.id],
        byIds: { ...state.byIds, [event.id]: event },
      };
    case DELETE_SUCCESS:
      const { id } = action.payload;
      const newState = {
        ...state,
        allIds: state.allIds.filter((storedId) => storedId !== id),
        byIds: { ...state.byIds },
      };
      delete newState.byIds[id];
      return newState;
    case UPDATE_SUCCESS:
      const updatedEvent = action.payload.event;
      return {
        ...state,
        byIds: { ...state.byIds, [updatedEvent.id]: updatedEvent },
      };

    default:
      return state;
  }
};

export default userEventsReducer;
