import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import { format, formatDistance } from "date-fns";
import styled from "styled-components";
import formatMoney from "../lib/formatMoney";
import Link from "next/link";
import OrderItemStyles from "./styles/OrderItemStyles";
import Error from "./ErrorMessage";

const USER_ORDERS_QUERY = gql`
  query USER_ORDERS_QUERY {
    orders(orderBy: createdAt_DESC) {
      id
      createdAt
      total
      user {
        id
      }
      items {
        id
        title
        description
        image
        price
        quantity
      }
    }
  }
`;

const OrderOl = styled.ol`
  display: grid;
  grid-gap: 4rem;
  grid-template-columns: repeat(auto-fit, minmax(40%, 1fr));
`;

export default class Orders extends Component {
  render() {
    return (
      <Query query={USER_ORDERS_QUERY}>
        {({ data, loading, error }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>loading</p>;
          const orders = data.orders;
          console.log(data);
          return (
            <div>
              <h1>Orders</h1>
              <p>You have placed {orders.length} orders in the past.</p>
              <OrderOl>
                {orders.map(order => {
                  //
                  return (
                    <OrderItemStyles key={order.id} className="order">
                      <Link
                        href={{
                          pathname: "/order",
                          query: { id: order.id }
                        }}
                      >
                        <a>
                          <h2>
                            {format(order.createdAt, "MMMM d, YYYY h:mm a")}
                          </h2>
                          <div className="order-meta">
                            <p>
                              {order.items.reduce((a, b) => {
                                return a + b.quantity;
                              }, 0)}{" "}
                              items.
                            </p>
                            <p>{formatDistance(order.createdAt, new Date())}</p>
                            <p>Items:</p>
                            <p>{formatMoney(order.total)}</p>
                          </div>
                          <div className="images">
                            {order.items.map(item => (
                              <img
                                key={item.id}
                                src={item.image}
                                alt={item.title}
                              />
                            ))}
                          </div>
                        </a>
                      </Link>
                    </OrderItemStyles>
                  );
                })}
              </OrderOl>
            </div>
          );
        }}
      </Query>
    );
  }
}
