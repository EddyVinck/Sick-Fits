import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { ThemeProvider } from "styled-components";
import { theme } from "../components/Page";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import Nav from "../components/Nav";

const notSignedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: null } }
  }
];

const signedInMocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: { data: { me: fakeUser() } }
  }
];

const signedInMocksWithCartItems = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem(), fakeCartItem(), fakeCartItem()]
        }
      }
    }
  }
];

describe("<Nav />", () => {
  it("renders a minimal nav when signed out", async () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={notSignedInMocks}>
          <Nav />
        </MockedProvider>
      </ThemeProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    const nav = wrapper.find('nav[data-test="nav"]');
    expect(nav.exists()).toEqual(true);
    expect(toJSON(nav)).toMatchSnapshot();
  });

  it("renders full nav when signed in", async () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={signedInMocks}>
          <Nav />
        </MockedProvider>
      </ThemeProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('nav[data-test="nav"]');
    expect(nav.exists()).toEqual(true);
    // console.log(nav.debug());
    expect(nav.children().length).toBe(2);
    expect(nav.text()).toMatch(/sign out/i);
    // console.log(nav.debug());
    // expect(toJSON(nav)).toMatchSnapshot();
  });

  it("renders the amount of items in the cart", async () => {
    const wrapper = mount(
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={signedInMocksWithCartItems}>
          <Nav />
        </MockedProvider>
      </ThemeProvider>
    );
    await wait();
    wrapper.update();
    const nav = wrapper.find('nav[data-test="nav"]');
    expect(nav.exists()).toEqual(true);
    const count = nav.find("div.count");
    expect(count.text()).toBe("9"); // every fake item has a quantity of 3
    expect(toJSON(count)).toMatchSnapshot();
    // console.log(count.debug());
    // expect(toJSON(nav)).toMatchSnapshot();
  });
});
