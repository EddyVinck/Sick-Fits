import React from "react";
import PaginationStyles from "./styles/PaginationStyles";
import Link from "next/link";
import Head from "next/head";

const Pagination = props => (
  <PaginationStyles data-test="pagination">
    <Head>
      <title>
        Adamant | Page {props.currentPage} of {props.pagesCount}
      </title>
    </Head>
    <Link prefetch href={props.prevPage}>
      <a className="prev" aria-disabled={props.prevDisabled}>
        ⬅ Prev
      </a>
    </Link>
    <p>
      Page {props.currentPage} of{" "}
      <span className="totalPages">{props.pagesCount}</span> pages.
    </p>
    <Link prefetch href={props.nextPage}>
      <a className="next" aria-disabled={props.nextDisabled}>
        Next ➡
      </a>
    </Link>
  </PaginationStyles>
);

export default Pagination;
