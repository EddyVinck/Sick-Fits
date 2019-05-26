import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import { CURRENT_USER_QUERY } from "../components/User";
import Order, { SINGLE_ORDER_QUERY } from "../components/Order";
import { ApolloConsumer } from "react-apollo";
import { fakeUser, fakeCartItem, fakeOrder } from "../lib/testUtils";
import NProgress from "nprogress";
import Error from "../components/ErrorMessage";
import Router from "next/router";

const order = fakeOrder();
const mocks = [
  {
    request: {
      query: SINGLE_ORDER_QUERY,
      variables: {
        id: order.id
      }
    },
    result: {
      data: {
        order: {
          ...order
        }
      }
    }
  }
];
describe("<Order />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <Order id={order.id} />
      </MockedProvider>
    );
    expect(wrapper.find("p").text()).toMatch(/loading/i);
    await wait();
    wrapper.update();
    expect(wrapper.find("li[data-test='order']").exists()).toBe(true);
    expect(toJSON(wrapper.find("li[data-test='order']"))).toMatchSnapshot();

    console.log(wrapper.debug());
  });
});
