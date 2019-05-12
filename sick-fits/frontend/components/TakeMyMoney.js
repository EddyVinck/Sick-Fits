import React, { Component } from "react";
import StripeCheckout from "react-stripe-checkout";
import { Mutation } from "react-apollo";
import Router from "next/router";
import NProgess from "nprogress";
import PropTypes from "prop-types";
import gql from "graphql-tag";
import calcTotalPrice from "../lib/calcTotalPrice";
import Error from "./ErrorMessage";
import User, { CURRENT_USER_QUERY } from "./User";

function totalItems(cart) {
  return cart.reduce((total, cartItem) => {
    return total + cartItem.quantity;
  }, 0);
}

class TakeMyMoney extends Component {
  onToken = res => {
    const stripeToken = res.id; // Send this to the server
    console.log(stripeToken);
  };
  render() {
    return (
      <User>
        {({ data: { me } }) => {
          console.log({ me });
          return (
            <StripeCheckout
              amount={calcTotalPrice(me.cart)}
              name="Sick Fits"
              description={`Order of ${totalItems(me.cart)} items!`}
              image={me.cart[0].item && me.cart[0].item.image}
              stripeKey="pk_test_X2Cdtliwtvhq0oR7pEaAPVjr00ndd16Zxj"
              currency="EUR"
              email={me.email}
              token={res => this.onToken(res)}
            >
              {this.props.children}
            </StripeCheckout>
          );
        }}
      </User>
    );
  }
}

export default TakeMyMoney;
