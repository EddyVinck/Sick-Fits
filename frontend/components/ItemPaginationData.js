import React, { Component } from "react";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Error from "./ErrorMessage";
import { perPage as itemsPerPage } from "../config";
import PropTypes from "prop-types";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

// This is a render prop provider component
class PaginationData extends Component {
  static propTypes = {
    loading: PropTypes.element,
    pathname: PropTypes.string,
    page: PropTypes.number.isRequired
  };
  static defaultProps = {
    loading: null,
    pathname: "items"
  };
  render() {
    return (
      <Query query={PAGINATION_QUERY}>
        {({ error, loading, data }) => {
          const loadingElement = this.props.loading || <p>Loading...</p>;
          if (error) return <Error error={error} />;
          if (loading) return loadingElement;
          const { count: itemCount } = data.itemsConnection.aggregate;
          const { page: currentPage, pathname } = this.props;
          const pagesCount = Math.ceil(itemCount / itemsPerPage);
          const prevPage = {
            pathname,
            query: { page: currentPage - 1 }
          };
          const nextPage = {
            pathname,
            query: { page: currentPage + 1 }
          };
          const prevDisabled = currentPage <= 1;
          const nextDisabled = currentPage >= pagesCount;
          return (
            <>
              {this.props.children({
                loading,
                currentPage,
                itemCount,
                pagesCount,
                prevPage,
                nextPage,
                prevDisabled,
                nextDisabled
              })}
            </>
          );
        }}
      </Query>
    );
  }
}

export default PaginationData;
export { PAGINATION_QUERY };
