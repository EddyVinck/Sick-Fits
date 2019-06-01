import styled from "styled-components";
import Link from "next/link";
import Nav from "./Nav";
import Router from "next/router";
import NProgress from "nprogress";
import Cart from "./Cart";

Router.onRouteChangeStart = () => {
  NProgress.start();
};
Router.onRouteChangeComplete = () => {
  NProgress.done();
};
Router.onRouteChangeError = () => {
  NProgress.done();
};

const StyledHeader = styled.header`
  .bar {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background: black;

    display: block;
    margin: 0 auto;

    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Nav />
    </div>
    <Cart />
  </StyledHeader>
);

export default Header;
