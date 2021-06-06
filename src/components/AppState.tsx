import React, { createContext, useContext, useState } from "react";

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
export const AppSetStateContext =
  createContext<
    React.Dispatch<React.SetStateAction<AppStateValue>> | undefined
  >(undefined);

interface Action<T> {
  type: T;
}

interface AddToCartAction extends Action<"ADD_TO_CART"> {
  payload: {
    item: CartItem;
  };
}

const reducer = (state: AppStateValue, action: AddToCartAction) => {
  if (action.type === "ADD_TO_CART") {
    const itemExist = state.cart.items.find(
      (item) => item.id === action.payload.item.id
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
          : [
              ...state.cart.items,
              {
                id: action.payload.item.id,
                name: action.payload.item.name,
                price: action.payload.item.price,
                quantity: 1,
              },
            ],
      },
    };
  }
  return state;
};

export const useSetState = () => {
  const setState = useContext(AppSetStateContext);
  if (!setState) {
    throw new Error(
      "useSetState was called outside of the AppSetStateContext.Provider"
    );
  }
  return setState;
};

const AppStateProvider: React.FC = ({ children }) => {
  const [state, setState] = useState(defaultStateValue);
  return (
    <AppStateContext.Provider value={state}>
      <AppSetStateContext.Provider value={setState}>
        {children}
      </AppSetStateContext.Provider>
    </AppStateContext.Provider>
  );
};

export default AppStateProvider;
