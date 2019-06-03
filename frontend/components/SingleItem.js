import React, { Component } from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import Head from "next/head";
import Error from "./ErrorMessage";
import styled from "styled-components";
import AddToCart from "./AddToCart";
import { sharedButtonStyles } from "./styles/Button";

const StyledAddToCart = styled(AddToCart)`
  ${sharedButtonStyles}
`;

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  min-height: 600px;
  padding-bottom: 60px;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    margin: 3rem;
    font-size: 2rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.small}) {
    min-height: 800px;
    display: grid;
    grid-auto-columns: 1fr;
    grid-auto-flow: column;
  }
`;

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      image
      largeImage
    }
  }
`;

class SingleItem extends Component {
  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id
        }}
      >
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />;
          if (loading) return <p>loading</p>;
          if (!data.item) return <p>No item found for {this.props.id}!</p>;
          const { item } = data;
          return (
            <SingleItemStyles>
              <Head>
                <title>Adamant | {item.title}</title>
              </Head>
              <img src={item.largeImage} alt={item.title} />
              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
                <StyledAddToCart id={this.props.id} />
              </div>
            </SingleItemStyles>
          );
        }}
      </Query>
    );
  }
}

export default SingleItem;
export { SINGLE_ITEM_QUERY };
