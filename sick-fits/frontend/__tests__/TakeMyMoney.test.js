import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import TakeMyMoney, { CREATE_ORDER_MUTATION } from "../components/TakeMyMoney";
import { ApolloConsumer } from "react-apollo";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import NProgress from "nprogress";
import Error from "../components/ErrorMessage";
import Router from "next/router";

Router.router = { push() {} };

const mocks = [
  {
    request: { query: CURRENT_USER_QUERY },
    result: {
      data: {
        me: {
          ...fakeUser(),
          cart: [fakeCartItem()]
        }
      }
    }
  }
];

describe("<TakeMyMoney />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const checkoutButton = wrapper.find("ReactStripeCheckout");
    expect(toJSON(checkoutButton)).toMatchSnapshot();
  });

  it("creates an order ontoken", async () => {
    // Mock the resolved Promise to the back-end
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    const component = wrapper.find("TakeMyMoney").instance();
    // console.log(component); // to check the properties
    // manually call the onToken method to avoid sending a request to Stripe
    component.onToken({ id: "abc123" }, createOrderMock);
    expect(createOrderMock).toHaveBeenCalled();
    expect(createOrderMock).toHaveBeenCalledWith({
      variables: { token: "abc123" }
    });
  });

  it("turns the progress bar on", async () => {
    // Mock the resolved Promise to the back-end
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    NProgress.start = jest.fn();
    const component = wrapper.find("TakeMyMoney").instance();
    // manually call the onToken method to avoid sending a request to Stripe
    component.onToken({ id: "abc123" }, createOrderMock);
    expect(NProgress.start).toHaveBeenCalled();
  });

  it("routes to the order page when completed", async () => {
    // Mock the resolved Promise to the back-end
    const createOrderMock = jest.fn().mockResolvedValue({
      data: { createOrder: { id: "xyz789" } }
    });
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <TakeMyMoney />
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    const component = wrapper.find("TakeMyMoney").instance();
    Router.router.push = jest.fn();
    // manually call the onToken method to avoid sending a request to Stripe
    component.onToken({ id: "abc123" }, createOrderMock);
    await wait();
    expect(Router.router.push).toHaveBeenCalled();
    expect(Router.router.push).toHaveBeenCalledWith({
      pathname: "/order",
      query: { id: "xyz789" }
    });
  });
});
