import React, { createContext, useContext, useEffect, useReducer } from "react";

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface AppStateValue {
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

// we create a different context for set state (for performance reasons)
// https://stackoverflow.com/questions/66776717/does-putting-state-and-dispatch-into-separate-context-providers-prevent-unnecess
// we try to avoid value={{state, dispatch}}, value={state} is fine because that is being passed by reference but when we wrap state & dispatch inside a new object, the value is being passed as a new object (state is guaranteed by react to be stable)
export const AppDispatchContext =
  createContext<
    React.Dispatch<InitializeCartAction | AddToCartAction> | undefined
  >(undefined);

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

export const useStateDispatch = () => {
  const setState = useContext(AppDispatchContext);
  if (!setState) {
    throw new Error(
      "useSetState was called outside of the AppSetStateContext.Provider"
    );
  }
  return setState;
};

// Refer to appStateContext.tsx and appDispatchContext
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
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
