// Test suite
describe("sample test", () => {
  it("works as expected", () => {
    expect(1).toEqual(1);
  });

  it("handles ranges just fine", () => {
    const age = 200;
    expect(age).toBeGreaterThan(100);
  });

  it("makes a list of dog names", () => {
    const dogs = ["test", "doggo"];
    expect(dogs).toEqual(dogs);
    expect(dogs).toContain("doggo");
  });
});
