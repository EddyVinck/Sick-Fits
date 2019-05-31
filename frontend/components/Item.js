import React, { Component } from "react";
import Link from "next/link";
import { PropTypes } from "prop-types";
import Title from "./styles/Title";
import ItemStyles from "./styles/ItemStyles";
import formatMoney from "../lib/formatMoney";
import DeleteItem from "./DeleteItem";
import AddToCart from "./AddToCart";

export default class Item extends Component {
  static propTypes = {
    item: PropTypes.object.isRequired
  };

  render() {
    const { item } = this.props;
    return (
      <ItemStyles>
        <Link
          href={{
            pathname: "/item",
            query: { id: item.id }
          }}
        >
          <a>
            {item.image && (
              <div className="img-wrapper">
                <img src={item.image} alt={item.title} />
              </div>
            )}
          </a>
        </Link>
        <div className="item__details">
          <Link
            href={{
              pathname: "/item",
              query: { id: item.id }
            }}
          >
            <a>
              <Title>{item.title}</Title>
              <p>{item.description}</p>
              <span className="price">{formatMoney(item.price)}</span>
            </a>
          </Link>
        </div>
        <div className="buttonList">
          <AddToCart id={item.id} />
          <Link href={{ pathname: "update", query: { id: item.id } }}>
            <a>Edit</a>
          </Link>
          <DeleteItem id={item.id}>Delete</DeleteItem>
        </div>
      </ItemStyles>
    );
  }
}
