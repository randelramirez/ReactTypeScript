import React, { createContext, useEffect, useReducer } from "react";
import {AppDispatchProvider} from "./appDispatchContext";

export interface CartItem {
    id: number;
    name: string;
    price: number;
    quantity: number;
}

export interface AppStateValue {
    cart: {
        items: CartItem[];
    };
}

const defaultStateValue: AppStateValue = {
    cart: {
        items: [],
    },
};

export const AppStateContext = createContext(defaultStateValue);

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

const reducer = (
    state: AppStateValue,
    action: InitializeCartAction | AddToCartAction
) => {
    switch (action.type) {
        case "INITIALIZE_CART":
            return { ...state, cart: action.payload.cart };

        case "ADD_TO_CART":
            const itemToAdd = action.payload.item;
            const itemExist = state.cart.items.find(
                (item) => item.id === itemToAdd.id
            );

            return {
                ...state,
                cart: {
                    ...state.cart,
                    items: itemExist
                        ? state.cart.items.map((item) => {
                            if (item.id === itemExist.id) {
                                return { ...item, quantity: itemExist.quantity + 1 };
                            } else {
                                return item;
                            }
                        })
                        : /*[...state.cart.items, itemToAdd]*/ [
                            ...state.cart.items,
                            { ...itemToAdd, quantity: 1 },
                        ],
                },
            };

        default:
            throw new Error("Uknown Action on the reducer");
    }
};

const AppStateProvider: React.FC = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, defaultStateValue);

    useEffect(() => {
        const cart = window.localStorage.getItem("cart");
        if (cart) {
            dispatch({
                type: "INITIALIZE_CART",
                payload: { cart: JSON.parse(cart) },
            });
        }
    }, []);

    useEffect(() => {
        window.localStorage.setItem("cart", JSON.stringify(state.cart));
    }, [state.cart]);

    return (
        <AppStateContext.Provider value={state}>
            <AppDispatchProvider dispatch={dispatch}>
                {children}
            </AppDispatchProvider>
        </AppStateContext.Provider>
    );
};

export default AppStateProvider;
