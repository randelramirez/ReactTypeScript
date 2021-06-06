import React from "react";
import { useStateDispatch, CartItem } from "./AppState";

export interface AddToCartProps {
  addToCart: (item: Omit<CartItem, "quantity">) => void;
}

// Using HOC
export function withAddToCart<OriginalProps>(
  ChildComponent: React.ComponentType<OriginalProps>
) {
  // We need to omit the AddToCartProps so that when we use the wrapped component ex. <PizzaItem></PizzaItem> so TS will know that it should not be checked
  // Note, we are returning <ChildComponent/> with the addToCart props this causes TS to check for the addToCart prop on wrappedComponents
  // Also, we need to ensure that when ex. <PizzaItem></PizzaItem>(which is wrapped in this HOC) is used we don't pass the addToCartProp like <PizzaItem addToCartProp={}></PizzaItem> because the goal of this HOC is to be the one responsible to pass that prop down
  const AddToCartHoc = (props: Omit<OriginalProps, keyof AddToCartProps>) => {
    const dispatch = useStateDispatch();
    const handleAddToCartClick: AddToCartProps["addToCart"] = (item) => {
      const { id, name, price } = item;
      dispatch({
        type: "ADD_TO_CART",
        payload: {
          item: { id, name, price },
        },
      });
    };
    return (
      <ChildComponent
        {...(props as OriginalProps)}
        addToCart={handleAddToCartClick}
      />
    );
  };

  return AddToCartHoc;
}

// Using Render Props
export const WithAddToCartProps: React.FC<{
  children: (props: AddToCartProps) => JSX.Element;
}> = ({ children }) => {
  const dispatch = useStateDispatch();
  const addToCart: AddToCartProps["addToCart"] = (item) => {
    const { id, name, price } = item;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: { id, name, price },
      },
    });
  };

  return children({ addToCart });
};

// Using Hooks
export const useToAddToCart = () => {
  const dispatch = useStateDispatch();
  const addToCart: AddToCartProps["addToCart"] = (item) => {
    const { id, name, price } = item;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: { id, name, price },
      },
    });
  };
  return addToCart;
};
