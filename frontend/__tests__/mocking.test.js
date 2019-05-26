function Person(name, foods) {
  this.name = name;
  this.foods = foods;
}

Person.prototype.fetchFavFoods = function() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(this.foods);
    }, 2000);
  });
};

describe("Mocking learning", () => {
  it("mocks a regular function", () => {
    const fetchDogs = jest.fn();
    fetchDogs("snickers");
    expect(fetchDogs).toHaveBeenCalled();
    expect(fetchDogs).toHaveBeenCalledWith("snickers");
    expect(fetchDogs).toHaveBeenCalledTimes(1);
  });

  it("can create a person", () => {
    const me = new Person("Eddy", ["Pizza", "Steak"]);
    expect(me.name).toBe("Eddy");
  });
  it("can fetch foods", async () => {
    const me = new Person("Eddy", ["Pizza", "Steak"]);
    // Mock fetchFavFoods
    me.fetchFavFoods = jest.fn().mockResolvedValue(["sushi", "pizza"]);
    const favFoods = await me.fetchFavFoods();

    expect(favFoods).toContain("pizza");
  });
});
