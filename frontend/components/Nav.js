import React, { Component } from "react";
import Link from "next/link";
import { Mutation } from "react-apollo";
import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignoutButton from "./Signout";
import CartCount from "./CartCount";
import styled from "styled-components";
import Search from "./Search";

const BottomBar = styled.div`
  background: black;
  width: 100%;
  max-width: 100%;

  .bar-inner {
    display: flex;
    flex-wrap: wrap;
    width: 100%;
    max-width: 100%;
    margin: 0 auto;
    justify-content: center;

    &.bar-space-between {
      display: flex;
      flex-direction: column;
    }

    .right {
      display: flex;
      justify-content: center;
      max-width: 100%;
    }

    @media (max-width: ${props => props.theme.breakpoints.small}) {
      .search-used {
        display: none;
      }
    }

    @media (min-width: ${props => props.theme.breakpoints.large}) {
      max-width: 1220px;
      justify-content: flex-end;

      &.bar-space-between {
        display: flex;
        justify-content: space-between;

        .right {
          display: flex;
          justify-content: flex-end;
        }
      }
    }
  }
`;
const TopBar = styled(BottomBar)`
  margin-bottom: 1rem;
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 1) 0%,
        rgba(0, 0, 0, 1) 20%,
        rgba(255, 255, 255, 0.3) 100%
      ),
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 1) 0%,
        rgba(255, 255, 255, 0.2) 100%
      );
  }
`;

const Logo = styled.h1`
  flex-basis: 100%;
  text-align: center;
  a {
    display: inline-flex;
    font-size: 2.4rem;
    position: relative;
    text-align: center;
    z-index: 2;
    padding: 0.5rem 1rem;
    background: white;
    color: black;
    text-transform: uppercase;
    text-decoration: none;
  }
  @media (min-width: ${props => props.theme.breakpoints.medium}) {
    a {
      font-size: 4rem;
      margin-left: 2rem;
      margin-right: 6rem;
      margin-bottom: 1.4rem;
    }
  }

  @media (min-width: ${props => props.theme.breakpoints.large}) {
    text-align: left;
    position: absolute;
    transform: translateY(-72px);
  }
`;

const LogoMobile = styled(Logo)`
  display: block;
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    display: none;
  }
`;

const LogoDesktop = styled(Logo)`
  display: none;
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    display: block;
  }
`;

class Nav extends Component {
  state = {
    isSearchUsed: false
  };
  handleSearchUsage = searchState => {
    this.setState({ isSearchUsed: searchState.isUsed });
  };
  render() {
    const isSearchUsed = this.state.isSearchUsed ? "search-used" : "";
    return (
      <User>
        {({ data: { me: loggedInUser } }) => (
          <NavStyles data-test="nav">
            <TopBar>
              <div className="bar-inner">
                <LogoMobile>
                  <Link href="/">
                    <a>Adamant</a>
                  </Link>
                </LogoMobile>
                {loggedInUser && (
                  <>
                    <Link href="/sell">
                      <a>Sell</a>
                    </Link>
                    <Link href="/orders">
                      <a>Orders</a>
                    </Link>
                    <Link href="/me">
                      <a>Account</a>
                    </Link>
                    <SignoutButton>Sign out</SignoutButton>
                  </>
                )}
                {!loggedInUser && (
                  <Link href="/signup">
                    <a>Sign In</a>
                  </Link>
                )}
              </div>
            </TopBar>
            <BottomBar>
              <div className="bar-inner bar-space-between">
                <div>
                  <LogoDesktop>
                    <Link href="/">
                      <a>Adamant</a>
                    </Link>
                  </LogoDesktop>
                </div>
                <div className="right">
                  <Link href="/items">
                    <a className={isSearchUsed}>Shop</a>
                  </Link>
                  <Search handleSearchUsage={this.handleSearchUsage} />
                  {loggedInUser && (
                    <Mutation mutation={TOGGLE_CART_MUTATION}>
                      {toggleCart => (
                        <button className={isSearchUsed} onClick={toggleCart}>
                          My cart
                          <CartCount
                            count={loggedInUser.cart.reduce(
                              (tally, cartItem) => {
                                return tally + cartItem.quantity;
                              },
                              0
                            )}
                          />
                        </button>
                      )}
                    </Mutation>
                  )}
                </div>
              </div>
            </BottomBar>
          </NavStyles>
        )}
      </User>
    );
  }
}

export default Nav;
