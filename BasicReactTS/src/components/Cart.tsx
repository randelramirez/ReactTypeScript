import React, {createRef} from "react";
import { FiShoppingCart } from "react-icons/fi";
import CartCSS from "./Cart.module.css";
import { AppStateContext } from "../appStateContext";

interface Props {}

interface State {
  isOpen: boolean;
}

class Cart extends React.Component<Props, State> {
  containerRef: React.RefObject<HTMLDivElement>;
  constructor(props: Props) {
    super(props);
    this.state = {
      isOpen: false,
    };
    this.containerRef = createRef();
  }

  handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    // if ((e.target as HTMLElement).nodeName === 'SPAN') {
    //   (e.target as HTMLSpanElement).;
    // }
    this.setState((prevState) => ({ isOpen: !prevState.isOpen }));
  };

  handler = (event: MouseEvent) => {
    // Node is a base of HTMLElement, HTMLDivElement etc.
    if(this.containerRef.current && !this.containerRef.current.contains(event.target as Node)){
      // close the cart if you click outside of it
      this.setState({isOpen: false})
    }
  }
  
  componentDidMount() {
    document.addEventListener('mousedown',this.handler)
  }
  
  componentWillUnmount() {
    document.removeEventListener('mousedown',this.handler)
  }

  render() {
    return (
      <AppStateContext.Consumer>
        {(state) => {
          const itemsCount = state.cart.items.reduce((sum, item) => {
            return sum + item.quantity;
          }, 0);
          return (
            <div className={CartCSS.cartContainer} ref={this.containerRef}>
              <button
                className={CartCSS.button}
                type="button"
                onClick={this.handleClick}
              >
                <FiShoppingCart />
                <span>{itemsCount} pizza(s)</span>
              </button>
              <div
                className={CartCSS.cartDropDown}
                style={{
                  display: this.state.isOpen ? "block" : "none",
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
  }
}

export default Cart;
