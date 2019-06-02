import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import Order, { SINGLE_ORDER_QUERY } from "../components/Order";
import { fakeOrder } from "../lib/testUtils";
import { ThemeProvider } from "styled-components";
import { theme } from "../components/Page";

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
      <ThemeProvider theme={theme}>
        <MockedProvider mocks={mocks}>
          <Order id={order.id} />
        </MockedProvider>
      </ThemeProvider>
    );
    expect(wrapper.find("p").text()).toMatch(/loading/i);
    await wait();
    wrapper.update();
    console.log(wrapper.debug());
    expect(wrapper.find("div[data-test='order']").exists()).toBe(true);
    expect(toJSON(wrapper.find("div[data-test='order']"))).toMatchSnapshot();
  });
});
