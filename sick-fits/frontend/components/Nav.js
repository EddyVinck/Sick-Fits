import Link from "next/link";
import { Mutation } from "react-apollo";
import { TOGGLE_CART_MUTATION } from "./Cart";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignoutButton from "./Signout";
import CartCount from "./CartCount";

const Nav = () => (
  <User>
    {({ data: { me: loggedInUser } }) => (
      <NavStyles>
        <Link href="/items">
          <a>Shop</a>
        </Link>
        {loggedInUser && (
          <>
            <Link href="/sell">
              <a>Sell</a>
            </Link>
            <Link href="/orders">
              <a>Orders</a>
            </Link>
            <Link href="/me">
              <a>Me</a>
            </Link>
            <SignoutButton>Sign out!</SignoutButton>
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
          </>
        )}
        {!loggedInUser && (
          <Link href="/signup">
            <a>Sign In</a>
          </Link>
        )}
      </NavStyles>
    )}
  </User>
);

export default Nav;
