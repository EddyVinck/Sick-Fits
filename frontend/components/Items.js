import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import styled from "styled-components";
import Item from "./Item";
import Pagination from "./Pagination";
import ItemPaginationData from "./ItemPaginationData";
import { perPage as itemsPerPage } from "../config";

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY($skip: Int = 0, $first: Int = ${itemsPerPage}) {
    items(first: $first, skip: $skip, orderBy: createdAt_DESC) {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`;

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  grid-gap: 18px;
  margin: 0 auto;

  @media (min-width: ${props => props.theme.breakpoints.medium}) {
    grid-template-columns: 1fr 1fr;
  }
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    grid-template-columns: 1fr 1fr 1fr;
    grid-gap: 24px;
    max-width: ${props => props.theme.maxWidth};
  }
`;

class Items extends Component {
  render() {
    const page = this.props.page;
    return (
      <div>
        <h1>All products</h1>
        <ItemPaginationData page={page}>
          {pagination => {
            return (
              <>
                <p>
                  {pagination.itemCount} products total | sorting by{" "}
                  <strong>most recent</strong>
                </p>
                <Pagination {...pagination} />
                <Query
                  query={ALL_ITEMS_QUERY}
                  // fetchPolicy="network-only" -> cache is unused
                  variables={{
                    skip: this.props.page * itemsPerPage - itemsPerPage,
                    first: itemsPerPage
                  }}
                >
                  {({ data, error, loading }) => {
                    if (loading) return <p>loading...</p>;
                    if (error) return <p>Error: {error.message}</p>;
                    return (
                      <ItemsList>
                        {data.items.map(item => (
                          <Item item={item} key={item.id} />
                        ))}
                      </ItemsList>
                    );
                  }}
                </Query>
                <Pagination {...pagination} />
              </>
            );
          }}
        </ItemPaginationData>
      </div>
    );
  }
}

export default Items;
export { ALL_ITEMS_QUERY };
