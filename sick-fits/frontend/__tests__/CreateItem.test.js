import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import CreateItem, { CREATE_ITEM_MUTATION } from "../components/CreateItem";
import Router from "next/router";
import { fakeItem } from "../lib/testUtils";

// mock the global fetch API
const dogImage = "https://dog.com/dog.jpg";
global.fetch = jest.fn().mockResolvedValue({
  json: () => ({
    secure_url: dogImage,
    eager: [{ secure_url: dogImage }]
  })
});

describe("<CreateItem />", () => {
  it("renders and matches snapshot", async () => {
    //
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const form = wrapper.find('form[data-test="form"]');
    expect(form.exists()).toBe(true);
    // console.log(form.debug());
    expect(toJSON(form)).toMatchSnapshot();
  });

  it("uploads a file", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    const input = wrapper.find('input[type="file"]');
    input.simulate("change", { target: { files: ["fakedog.jpg"] } });
    await wait();
    const component = wrapper.find("CreateItem").instance();
    expect(component.state.image).toEqual(dogImage);
    expect(component.state.largeImage).toEqual(dogImage);
    expect(global.fetch).toHaveBeenCalled();
    global.fetch.mockReset();
  });

  it("handles state updating", async () => {
    const wrapper = mount(
      <MockedProvider>
        <CreateItem />
      </MockedProvider>
    );
    wrapper
      .find("#title")
      .simulate("change", { target: { value: "Testing", name: "title" } });
    wrapper.find("#price").simulate("change", {
      target: { value: 50000, name: "price", type: "number" }
    });

    wrapper.find("#description").simulate("change", {
      target: { value: "Testing a really nice item", name: "description" }
    });

    expect(wrapper.find("CreateItem").instance().state).toMatchObject({
      title: "Testing",
      price: 50000,
      description: "Testing a really nice item"
    });
  });

  it("creates an item when the form is submitted", async () => {
    const item = fakeItem();
    const mocks = [
      {
        request: {
          query: CREATE_ITEM_MUTATION,
          variables: {
            title: item.title,
            description: item.description,
            image: "", // Leaving this blank since the image is already tested & errors occur when the data doesn't match the data in the form
            // image: 'something else', <- this would cause an error
            largeImage: "", // Although the field is not required for the query it is requered as input
            price: item.price
          }
        },
        result: {
          data: {
            // The data must contain the the data in the query
            createItem: {
              id: "abc123", // this is required
              __typename: "Item", // this is required
              prop_that_does_not_exist: "sure, why not" // this is fine
              // ...item <- and that is why this works
              // ...fakeItem <- or even a function
              // When you add the title attribute to the query's returned attributes in CreateItem.js you get a missing field error if you omit title here
            }
          }
        }
      }
    ];

    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <CreateItem />
      </MockedProvider>
    );

    wrapper
      .find("#title")
      .simulate("change", { target: { value: item.title, name: "title" } });
    wrapper.find("#price").simulate("change", {
      target: { value: item.price, name: "price", type: "number" }
    });
    wrapper.find("#description").simulate("change", {
      target: { value: item.description, name: "description" }
    });

    // Mock the router
    Router.router = {
      push: jest.fn()
    };
    wrapper.find("form").simulate("submit");
    await wait(50);
    expect(Router.router.push).toHaveBeenCalled();
  });
});
