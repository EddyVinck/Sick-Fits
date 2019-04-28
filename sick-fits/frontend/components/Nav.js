import Link from "next/link";
import NavStyles from "./styles/NavStyles";
import User from "./User";
import SignoutButton from "./Signout";

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
            <Link href="/order">
              <a>Order</a>
            </Link>
            <Link href="/me">
              <a>Me</a>
            </Link>
            <SignoutButton>Sign out!</SignoutButton>
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
