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

const Logo = styled.h1`
  font-size: 2.4rem;
  margin-bottom: 1.4rem;
  position: relative;
  text-align: center;
  z-index: 2;
  a {
    padding: 0.5rem 1rem;
    background: white;
    color: black;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (min-width: ${props => props.theme.breakpoints.medium}) {
    font-size: 4rem;
    margin-left: 2rem;
    margin-right: 6rem;
    margin-bottom: 1.4rem;
  }

  @media (min-width: ${props => props.theme.breakpoints.large}) {
    text-align: left;
  }
`;

const StyledHeader = styled.header`
  .bar {
    display: grid;
    grid-template-columns: auto 1fr;
    justify-content: space-between;
    align-items: stretch;
    background: black;

    @media (max-width: 1300px) {
      grid-template-columns: 1fr;
      justify-content: center;
    }
  }
`;

const Header = () => (
  <StyledHeader>
    <div className="bar">
      <Logo>
        <Link href="/">
          <a>Adamant</a>
        </Link>
      </Logo>
      <Nav />
    </div>
    <Cart />
  </StyledHeader>
);

export default Header;
