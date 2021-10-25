import React from "react";
import PizzaCSS from "./Pizza.module.css";
import { Pizza } from "../types";
import withAddToCart, {AddToCartProps, useAddToCart} from "./withAddToCart";

export interface Props extends AddToCartProps {
    pizza: Pizza;
}

const PizzaItemWithCustomHook: React.FC<Props> = ({ pizza }) => {
    const addToCart = useAddToCart();
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

export default PizzaItemWithCustomHook;
