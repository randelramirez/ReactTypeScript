import React, { useEffect, useRef, useState } from "react";
import { FiShoppingCart } from "react-icons/fi";
import CartCSS from "./Cart.module.css";
import { AppStateContext } from "../appStateContext";

interface Props {}

export const Cart: React.FC<Props> = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // if ((e.target as HTMLElement).nodeName === 'SPAN') {
    //   (e.target as HTMLSpanElement).;
    // }
    // this.setState((prevState) => ({ isOpen: !prevState.isOpen }));

    setIsOpen((currentState) => !currentState);
  };

  const handler = (event: MouseEvent) => {
    // Node is a base of HTMLElement, HTMLDivElement etc.
    if (
      containerRef.current &&
      !containerRef.current.contains(event.target as Node)
    ) {
      // close the cart if you click outside of it
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <AppStateContext.Consumer>
      {(state) => {
        const itemsCount = state.cart.items.reduce((sum, item) => {
          return sum + item.quantity;
        }, 0);
        return (
          <div className={CartCSS.cartContainer} ref={containerRef}>
            <button
              className={CartCSS.button}
              type="button"
              onClick={handleClick}
            >
              <FiShoppingCart />
              <span>{itemsCount} pizza(s)</span>
            </button>
            <div
              className={CartCSS.cartDropDown}
              style={{
                display: isOpen ? "block" : "none",
              }}
            >
              <ul>
                {state.cart.items.map((item) => (
                  <li key={item.id}>
                    {item.name} &times; {item.quantity}{" "}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      }}
    </AppStateContext.Consumer>
  );
};

export default Cart;
