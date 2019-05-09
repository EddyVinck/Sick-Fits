import React, { Component } from "react";
import { Mutation } from "react-apollo";
import styled from "styled-components";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import { CURRENT_USER_QUERY } from "./User";

const REMOVE_FROM_CART_MUTATION = gql`
  mutation REMOVE_FROM_CART_MUTATION($id: ID!) {
    removeFromCart(id: $id) {
      id
    }
  }
`;

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: none;
  cursor: pointer;

  &:hover {
    color: ${props => props.theme.red};
  }
`;

class RemoveFromCart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired
  };
  // This gets called as soon as we get a response back from the server after a mutation has been performed
  update = (cache, payload) => {
    console.log("delete item update");
    // read the cache
    const data = cache.readQuery({ query: CURRENT_USER_QUERY });
    console.log({ data, payload });
    // remove the item from the cache
    const cartItemId = payload.data.removeFromCart.id;
    // me === currentUser
    data.me.cart = data.me.cart.filter(cartItem => cartItem.id !== cartItemId);
    cache.writeQuery({ query: CURRENT_USER_QUERY, data });
  };
  render() {
    return (
      <Mutation
        mutation={REMOVE_FROM_CART_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}
        optimisticResponse={{
          __typename: "Mutation",
          removeFromCart: {
            __typename: "CartItem",
            id: this.props.id
          }
        }}
      >
        {(removeFromCart, { loading, error }) => {
          return (
            <BigButton
              disabled={loading}
              onClick={() => {
                removeFromCart().catch(err => alert(err.message));
              }}
              title="DeleteItem"
            >
              &times;
            </BigButton>
          );
        }}
      </Mutation>
    );
  }
}

export default RemoveFromCart;
