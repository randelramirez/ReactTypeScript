import React from "react";
import PizzaCSS from "./Pizza.module.css";
import { Pizza } from "../types";
import withAddToCart, {AddToCartProps, WithAddToCartProps} from "./withAddToCart";

export interface Props extends AddToCartProps {
    pizza: Pizza;
}

// instead of using Hoc, we are going to use render props
const PizzaItemWithRenderProps: React.FC<Props> = ({ pizza }) => {
    return (
        <li className={PizzaCSS.container}>
            <h2>{pizza.name}</h2>
            <p>{pizza.description}</p>
            <p>{pizza.price}</p>
            <WithAddToCartProps>
                {({addToCart}) => {
                    const { id, name, price } = pizza;
                    return <button type="button" onClick={()=>{   addToCart({ id, name, price })}}>
                        Add to Cart
                    </button>
                }}
            </WithAddToCartProps>
           
        </li>
    );
};

export default PizzaItemWithRenderProps;
