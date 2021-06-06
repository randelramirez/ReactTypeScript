import React from "react";
import { Pizza } from "../types";
import { useStateDispatch } from "./AppState";
import SpecialOfferCSS from "./SpecialOffer.module.css";

interface Props {
  pizza: Pizza;
}

const SpecialOffer: React.FC<Props> = ({ pizza }) => {
  const dispatch = useStateDispatch();
  const handleAddToCartClick = () => {
    const { id, name, price } = pizza;
    dispatch({
      type: "ADD_TO_CART",
      payload: {
        item: { id, name, price },
      },
    });
  };
  return (
    <div className={SpecialOfferCSS.container}>
      <h2>{pizza.name}</h2>
      <p>{pizza.description}</p>
      <p>{pizza.price}</p>
      <button type="button" onClick={handleAddToCartClick}>
        Add to Cart
      </button>
    </div>
  );
};

export default SpecialOffer;
