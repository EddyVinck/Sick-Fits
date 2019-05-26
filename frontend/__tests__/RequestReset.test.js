import { mount } from "enzyme";
import wait from "waait";
import toJSON from "enzyme-to-json";
import { MockedProvider } from "react-apollo/test-utils";
import RequestReset, {
  REQUEST_RESET_MUTATION
} from "../components/RequestReset";

const mocks = [
  {
    request: {
      query: REQUEST_RESET_MUTATION,
      variables: { email: "eddyvinck95@gmail.com" }
    },
    result: {
      data: {
        requestReset: { message: "success", __typename: "Message" }
      }
    }
  }
];

describe("<RequestReset />", () => {
  it("renders and matches snapshot", async () => {
    const wrapper = mount(
      <MockedProvider>
        <RequestReset />
      </MockedProvider>
    );
    // console.log(wrapper.debug());
    const form = wrapper.find('form[data-test="form"]');
    expect(toJSON(form)).toMatchSnapshot();
    // console.log(form.debug());
  });

  it("can input the form & then calls the mutation", async () => {
    const wrapper = mount(
      <MockedProvider mocks={mocks}>
        <RequestReset />
      </MockedProvider>
    );
    // console.log(wrapper.debug());

    // simulate typing an email
    wrapper.find("input").simulate("change", {
      target: { name: "email", value: "eddyvinck95@gmail.com" }
    });
    wrapper.find("form").simulate("submit");
    await wait(5);
    wrapper.update();
    expect(wrapper.find("p").text()).toContain(
      "Check your email for a reset link."
    );
  });
});
