import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import { adopt } from "react-adopt";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";
import User from "./User";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";
import TakeMyMoney from "./TakeMyMoney";

const LOCAL_STATE_QUERY = gql`
  query LOCAL_STATE_QUERY {
    cartOpen @client # the @client directive tells Apollo to fetch this data from the client's Apollo store
  }
`;

const TOGGLE_CART_MUTATION = gql`
  mutation TOGGLE_CART_MUTATION {
    toggleCart @client
  }
`;

// the destructured render method prevents the error:
// checkPropTypes.js:19 Warning: Failed prop type: The prop `children` is marked as required in `User`/`Mutation`/`Query`, but its value is `undefined`.
const Composed = adopt({
  user: ({ render }) => <User>{render}</User>,
  toggleCart: ({ render }) => (
    <Mutation mutation={TOGGLE_CART_MUTATION}>{render}</Mutation>
  ),
  localState: ({ render }) => <Query query={LOCAL_STATE_QUERY}>{render}</Query>
});

const Cart = props => {
  return (
    <Composed>
      {({ user, toggleCart, localState }) => {
        const currentUser = user.data.me;
        if (!currentUser) return null;
        // Grammar check if it needs to be Eddy's cart or Wes' cart
        const userNameSuffix =
          currentUser.name[currentUser.name.length - 1] === "s" ? "'" : "'s";
        return (
          <CartStyles open={localState.data.cartOpen}>
            <header>
              <CloseButton onClick={toggleCart} title="close">
                &times;
              </CloseButton>
              <Supreme>{currentUser.name + userNameSuffix} Cart</Supreme>
              <p>
                You have {currentUser.cart.length} item
                {currentUser.cart.length === 1 ? "" : "s"} in your cart.
              </p>
            </header>
            <ul>
              {currentUser.cart.map(cartItem => (
                <CartItem key={cartItem.id} cartItem={cartItem} />
              ))}
            </ul>
            <footer>
              <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
              <TakeMyMoney>
                <SickButton>Checkout</SickButton>
              </TakeMyMoney>
            </footer>
          </CartStyles>
        );
      }}
    </Composed>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
