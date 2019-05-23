import ItemComponent from "../components/Item";
import { shallow } from "enzyme";
import toJSON from "enzyme-to-json";

const fakeItem = {
  id: "ABC123",
  title: "A test item",
  price: 5000,
  description: "This is a really nice item.",
  image: "sunglasses.jpg",
  largeImage: "largesunglasses.jpg"
};

describe("<Item/>", () => {
  it("renders pricetag and title properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const PriceTag = wrapper.find("PriceTag");
    expect(PriceTag.children().text()).toBe("€50");
    // console.log(wrapper.debug());

    expect(wrapper.find("Title a").text()).toBe(fakeItem.title);
  });

  it("renders the image properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const img = wrapper.find("img");
    const { src, alt } = img.props();
    expect(src).toBe(fakeItem.image);
    expect(alt).toBe(fakeItem.title);
    // console.log(img.debug());
  });

  it("renders out the buttons properly", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    const buttonList = wrapper.find(".buttonList");

    expect(buttonList.children()).toHaveLength(3);
    expect(buttonList.find("Link").exists()).toBe(true);
    expect(buttonList.find("AddToCart").exists()).toBe(true);
    expect(buttonList.find("DeleteItem").exists()).toBe(true);
  });

  it("renders and matches the snapshot", () => {
    const wrapper = shallow(<ItemComponent item={fakeItem} />);
    expect(toJSON(wrapper)).toMatchSnapshot();
  });
});
