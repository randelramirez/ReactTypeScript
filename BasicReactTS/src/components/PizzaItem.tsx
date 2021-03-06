import React from "react";
import PizzaCSS from "./Pizza.module.css";
import { Pizza } from "../types";
import withAddToCart, { AddToCartProps  } from "./withAddToCart";

export interface Props extends AddToCartProps {
  pizza: Pizza;
}

const PizzaItem: React.FC<Props> = ({ pizza, addToCart }) => {
  const handleAddToCartClick = () => {
    const { id, name, price } = pizza;
    addToCart({ id, name, price });
  };

  return (
    <li className={PizzaCSS.container}>
      <h2>{pizza.name}</h2>
      <p>{pizza.description}</p>
      <p>{pizza.price}</p>
      <button type="button" onClick={handleAddToCartClick}>
        Add to Cart
      </button>
    </li>
  );
};

export default withAddToCart(PizzaItem);
