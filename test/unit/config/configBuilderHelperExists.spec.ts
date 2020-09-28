import {ConfigBuilderHelperExists} from "../../../src";

describe("config/ConfigBuilderHelperExists", () => {
  it(`helper name must be "exists"`, () => {
    const configBuilderHelperExists = new ConfigBuilderHelperExists();

    expect(configBuilderHelperExists.name).toStrictEqual("exists");
  });

  it("must return false if some values doesn't exist", () => {
    const configBuilderHelperExists = new ConfigBuilderHelperExists();

    expect(
      configBuilderHelperExists.processSync("", 0, true, false, null),
    ).toStrictEqual(false);
  });

  it("must return true if all values exists", () => {
    const configBuilderHelperExists = new ConfigBuilderHelperExists();

    expect(
      configBuilderHelperExists.processSync("", 0, true, false),
    ).toStrictEqual(true);
  });
});
