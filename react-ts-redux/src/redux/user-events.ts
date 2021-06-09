import { AnyAction } from "redux";

interface UserEvent {
    id: number;
    title:string;
    dateStart: string;
    dateEnd: string;
}

interface UserEventsState {
    byIds: Record<UserEvent['id'], UserEvent>
    byAllIds: UserEvent['id'][];
}

const initialState: UserEventsState = {
    byIds: {},
    byAllIds: []
}

const userEventsReducer = (state: UserEventsState = initialState, action: AnyAction) => {
    switch(action.type){
    

        default:
            return state;
    }
}

export default userEventsReducer;