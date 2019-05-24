import { mount } from "enzyme";
import wait from "waait";
import { CURRENT_USER_QUERY } from "../components/User";
import { MockedProvider } from "react-apollo/test-utils";
import { fakeUser } from "../lib/testUtils";
import PleaseSignIn from "../components/PleaseSignIn";

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

describe("<PleaseSignIn />", () => {
  it("renders the sign in dialog to logged out users", async () => {
    const wrapper = mount(
      <MockedProvider mocks={notSignedInMocks}>
        <PleaseSignIn />
      </MockedProvider>
    );

    expect(wrapper.find("p").text()).toMatch(/loading/i);
    await wait();
    wrapper.update();
    expect(wrapper.text()).toMatch(/sign in/i);
    // console.log(wrapper.debug());
    expect(wrapper.find("Signin").exists()).toEqual(true);
  });

  it("renders the child component when the user is signed in", async () => {
    const wrapper = mount(
      <MockedProvider mocks={signedInMocks}>
        <PleaseSignIn>
          <p>This is the child component</p>
        </PleaseSignIn>
      </MockedProvider>
    );
    await wait();
    wrapper.update();
    // console.log(wrapper.debug());
    expect(wrapper.find("p").text()).not.toMatch(/childish component/i);
    expect(wrapper.find("p").text()).toMatch(/child component/i);
  });
});
