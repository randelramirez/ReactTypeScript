import React, { createContext, useContext, useReducer } from "react";

interface CartItem {
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
export const AppDispatchContext =
  createContext<React.Dispatch<AddToCartAction> | undefined>(undefined);

interface Action<T> {
  type: T;
}

interface AddToCartAction extends Action<"ADD_TO_CART"> {
  payload: {
    item: Omit<CartItem, "quantity">;
  };
}

const reducer = (state: AppStateValue, action: AddToCartAction) => {
  if (action.type === "ADD_TO_CART") {
    const itemToAdd = action.payload.item;
    const itemExist = state.cart.items.find((item) => item.id === itemToAdd.id);

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
  }
  return state;
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

const AppStateProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, defaultStateValue);
  return (
    <AppStateContext.Provider value={state}>
      <AppDispatchContext.Provider value={dispatch}>
        {children}
      </AppDispatchContext.Provider>
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
