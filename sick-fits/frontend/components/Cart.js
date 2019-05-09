import React from "react";
import { Query, Mutation } from "react-apollo";
import gql from "graphql-tag";
import CartStyles from "./styles/CartStyles";
import Supreme from "./styles/Supreme";
import CloseButton from "./styles/CloseButton";
import SickButton from "./styles/SickButton";
import User from "./User";
import CartItem from "./CartItem";
import calcTotalPrice from "../lib/calcTotalPrice";
import formatMoney from "../lib/formatMoney";

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

const Cart = props => {
  return (
    <User>
      {({ data: { me: currentUser } }) => {
        if (!currentUser) return null;
        console.log(currentUser);
        // Check if it needs to be Eddy's cart or Wes' cart
        const userNameSuffix =
          currentUser.name[currentUser.name.length - 1] === "s" ? "'" : "'s";
        return (
          <Mutation mutation={TOGGLE_CART_MUTATION}>
            {toggleCart => {
              return (
                <Query query={LOCAL_STATE_QUERY}>
                  {({ data }) => {
                    return (
                      <CartStyles open={data.cartOpen}>
                        <header>
                          <CloseButton onClick={toggleCart} title="close">
                            &times;
                          </CloseButton>
                          <Supreme>
                            {currentUser.name + userNameSuffix} Cart
                          </Supreme>
                          <p>
                            You have {currentUser.cart.length} item
                            {currentUser.cart.length === 1 ? "" : "s"} in your
                            cart.
                          </p>
                        </header>
                        <ul>
                          {currentUser.cart.map(cartItem => (
                            <CartItem key={cartItem.id} cartItem={cartItem} />
                          ))}
                        </ul>
                        <footer>
                          <p>{formatMoney(calcTotalPrice(currentUser.cart))}</p>
                          <SickButton>Checkout</SickButton>
                        </footer>
                      </CartStyles>
                    );
                  }}
                </Query>
              );
            }}
          </Mutation>
        );
      }}
    </User>
  );
};

export default Cart;
export { LOCAL_STATE_QUERY, TOGGLE_CART_MUTATION };
