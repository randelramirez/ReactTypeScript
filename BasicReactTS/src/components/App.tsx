import React from "react";
import pizzas from "../data/pizzas.json";
import PizzaItem from "./PizzaItem";
import Cart from "./Cart";
import AppCSS from "./App.module.css";
import PizzaSVG from "../svg/pizza.svg";
import AppStateProvider from "../appStateContext";
import SpecialOffer from "./SpecialOffer";

const App = () => {
  const specialOffer = pizzas.find((pizza) => pizza.specialOffer === true);
  return (
    <AppStateProvider>
      <div className={AppCSS.container}>
        <div className={AppCSS.header}>
          <PizzaSVG width={120} height={120} />
          <div className={AppCSS.siteTitle}>Delicious Pizza</div>
          <Cart />
        </div>
        {specialOffer && <SpecialOffer pizza={specialOffer}></SpecialOffer>}
        <ul className={AppCSS.pizzaList}>
          {pizzas.map((pizza) => {
            return <PizzaItem key={pizza.id} pizza={pizza} />;
          })}
        </ul>
      </div>
    </AppStateProvider>
  );
};

export default App;
