import React from "react";
import formatMoney from "../lib/formatMoney";
import styled from "styled-components";
import PropTypes from "prop-types";
import RemoveFromCart from "./RemoveFromCart";

const CartItemStyles = styled.li`
  padding: 1rem 0;
  border-bottom: 1px solid ${props => props.theme.lightgrey};
  display: grid;
  align-items: center;
  grid-template-columns: auto 1fr auto;

  h3,
  p {
    margin: 0;
  }
`;

const ImagePlaceHolder = styled.div`
  width: 100px;
  margin-right: 10px;

  img {
    max-width: 100%;
  }
`;

export default function CartItem({ cartItem }) {
  // First check if that item exists (could have been deleted)
  if (!cartItem.item)
    return (
      <CartItemStyles>
        <ImagePlaceHolder />
        <p>This item has been removed.</p>
        <RemoveFromCart id={cartItem.id} />
      </CartItemStyles>
    );
  const { id, title, description, image, price } = cartItem.item;
  const { quantity } = cartItem;
  return (
    <CartItemStyles>
      <ImagePlaceHolder>
        <img src={image} alt={title} />
      </ImagePlaceHolder>
      <div className="cart-item-details">
        <h3>{title}</h3>
        <p>
          {formatMoney(quantity * price)}
          {" - "}
          <em>
            {quantity} &times; {formatMoney(price)} each
          </em>
        </p>
      </div>
      <RemoveFromCart id={cartItem.id} />
    </CartItemStyles>
  );
}

CartItem.propTypes = {
  cartItem: PropTypes.object.isRequired
};
