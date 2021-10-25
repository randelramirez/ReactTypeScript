import React, {createContext, ReactNode, useContext, useEffect, useReducer} from "react";
import {AppStateValue, CartItem} from "./appStateContext";

interface Action<T> {
    type: T;
}

interface InitializeCartAction extends Action<"INITIALIZE_CART"> {
    //payload: AppStateValue; or we can access the interface property like below
    payload: {
        cart: AppStateValue["cart"];
    };
}

interface AddToCartAction extends Action<"ADD_TO_CART"> {
    payload: {
        item: Omit<CartItem, "quantity">;
    };
}

interface Props {
    dispatch:  React.Dispatch<InitializeCartAction | AddToCartAction>
}

// we create a different context for set state (for performance reasons)
// https://stackoverflow.com/questions/66776717/does-putting-state-and-dispatch-into-separate-context-providers-prevent-unnecess
export const AppDispatchContext =
    createContext<
        React.Dispatch<InitializeCartAction | AddToCartAction> | undefined
        >(undefined);

export const useStateDispatch = () => {
    const setState = useContext(AppDispatchContext);
    if (!setState) {
        throw new Error(
            "useSetState was called outside of the AppSetStateContext.Provider"
        );
    }
    return setState;
};

export const AppDispatchProvider: React.FC<Props> = ({dispatch, children}) => {
    return <AppDispatchContext.Provider value={dispatch}>
        {children}
    </AppDispatchContext.Provider>
}


