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
  display: flex;
  background: black;
  @media (min-width: ${props => props.theme.breakpoints.large}) {
    justify-content: flex-end;
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

const Nav = () => (
  <User>
    {({ data: { me: loggedInUser } }) => (
      <NavStyles data-test="nav">
        <TopBar>
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
        </TopBar>
        <BottomBar>
          <Link href="/items">
            <a>Shop</a>
          </Link>
          <Search />
          {loggedInUser && (
            <Mutation mutation={TOGGLE_CART_MUTATION}>
              {toggleCart => (
                <button onClick={toggleCart}>
                  My cart
                  <CartCount
                    count={loggedInUser.cart.reduce((tally, cartItem) => {
                      return tally + cartItem.quantity;
                    }, 0)}
                  />
                </button>
              )}
            </Mutation>
          )}
        </BottomBar>
      </NavStyles>
    )}
  </User>
);

export default Nav;
