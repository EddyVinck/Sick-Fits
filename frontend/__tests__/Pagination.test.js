import { mount } from "enzyme";
import toJSON from "enzyme-to-json";
import wait from "waait";
import { MockedProvider } from "react-apollo/test-utils";
import Router from "next/router";
import { fakeUser, fakeCartItem } from "../lib/testUtils";
import ItemPaginationData, {
  PAGINATION_QUERY
} from "../components/ItemPaginationData";
import Pagination from "../components/Pagination";
import { perPage as itemsPerPage } from "../config";

// push and prefetch only work in the front-end and this causes errors in the tests. Faking those methods to fix that.
Router.router = {
  push() {},
  prefetch() {}
};

function makeMocksFor(length) {
  return [
    {
      request: {
        query: PAGINATION_QUERY
      },
      result: {
        data: {
          itemsConnection: {
            __typename: "aggregate",
            aggregate: {
              __typename: "count",
              count: length
            }
          }
        }
      }
    }
  ];
}

describe("<Pagination />", () => {
  it("displays a loading message", () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(1)}>
        <ItemPaginationData page={1}>
          {data => <Pagination {...data} />}
        </ItemPaginationData>
      </MockedProvider>
    );
    expect(wrapper.find("p").text()).toMatch(/loading/i);
    // console.log(wrapper.debug());
    const pagination = wrapper.find('div[data-test="pagination"]');
    // console.log(pagination.debug());
    expect(toJSON(pagination)).toMatchSnapshot();
  });

  it("renders pagination for 18 items", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <ItemPaginationData page={1}>
          {data => <Pagination {...data} />}
        </ItemPaginationData>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    const pagination = wrapper.find('div[data-test="pagination"]');
    // console.log(wrapper.debug());
    expect(wrapper.find(".totalPages").text()).toEqual(
      `${Math.ceil(18 / itemsPerPage)}`
    );
    expect(toJSON(pagination)).toMatchSnapshot();
  });

  it("disables prev button on the first page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <ItemPaginationData page={1}>
          {data => <Pagination {...data} />}
        </ItemPaginationData>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(true);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
  });

  it("disables next button on the last page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <ItemPaginationData page={Math.ceil(18 / itemsPerPage)}>
          {data => <Pagination {...data} />}
        </ItemPaginationData>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(true);
  });

  it("enables every button on a middle page", async () => {
    const wrapper = mount(
      <MockedProvider mocks={makeMocksFor(18)}>
        <ItemPaginationData page={Math.ceil(18 / itemsPerPage / 2)}>
          {data => <Pagination {...data} />}
        </ItemPaginationData>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find("a.prev").prop("aria-disabled")).toEqual(false);
    expect(wrapper.find("a.next").prop("aria-disabled")).toEqual(false);
  });
});
