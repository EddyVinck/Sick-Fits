import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import Link from "next/link";
import Head from "next/head";
import Error from "./ErrorMessage";
import { perPage as itemsPerPage } from "../config";

const PAGINATION_QUERY = gql`
  query PAGINATION_QUERY {
    itemsConnection {
      aggregate {
        count
      }
    }
  }
`;

const Pagination = props => (
  <Query query={PAGINATION_QUERY}>
    {({ error, loading, data }) => {
      if (error) return <Error error={error} />;
      if (loading) return <p>Loading..</p>;
      const { count } = data.itemsConnection.aggregate;
      const { page: currentPage } = props;
      const pagesCount = Math.ceil(count / itemsPerPage);
      return (
        <PaginationStyles data-test="pagination">
          <Head>
            <title>
              Sick Fits! | Page {currentPage} of {pagesCount}
            </title>
          </Head>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: currentPage - 1 }
            }}
          >
            <a className="prev" aria-disabled={currentPage <= 1}>
              ⬅ Prev
            </a>
          </Link>
          <p>
            Page {currentPage} of
            <span className="totalPages">{pagesCount}</span>
            pages.
          </p>
          <p>{count} Items Total</p>
          <Link
            prefetch
            href={{
              pathname: "items",
              query: { page: currentPage + 1 }
            }}
          >
            <a className="next" aria-disabled={currentPage >= pagesCount}>
              Next ➡
            </a>
          </Link>
        </PaginationStyles>
      );
    }}
  </Query>
);

export default Pagination;
export { PAGINATION_QUERY };
