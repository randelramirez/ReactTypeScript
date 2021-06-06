// import React from "react";
// import { Pizza } from "../types";
// import { withAddToCart, AddToCartProps } from "./AddToCart";
// import SpecialOfferCSS from "./SpecialOffer.module.css";

// interface Props extends AddToCartProps {
//   pizza: Pizza;
// }

// const SpecialOffer: React.FC<Props> = ({ pizza, addToCart }) => {
//   const handleAddToCartClick = () => {
//     addToCart({ ...pizza });
//   };
//   return (
//     <div className={SpecialOfferCSS.container}>
//       <h2>{pizza.name}</h2>
//       <p>{pizza.description}</p>
//       <p>{pizza.price}</p>
//       <button type="button" onClick={handleAddToCartClick}>
//         Add to Cart
//       </button>
//     </div>
//   );
// };

// export default withAddToCart(SpecialOffer);

// using render props
import React from "react";
import { Pizza } from "../types";
import { WithAddToCartProps } from "./AddToCart";
import SpecialOfferCSS from "./SpecialOffer.module.css";

interface Props {
  pizza: Pizza;
}

const SpecialOffer: React.FC<Props> = ({ pizza }) => {
  return (
    <div className={SpecialOfferCSS.container}>
      <h2>{pizza.name}</h2>
      <p>{pizza.description}</p>
      <p>{pizza.price}</p>
      <WithAddToCartProps>
        {({ addToCart }) => (
          <button type="button" onClick={() => addToCart({ ...pizza })}>
            Add to Cart
          </button>
        )}
      </WithAddToCartProps>
    </div>
  );
};

export default SpecialOffer;
