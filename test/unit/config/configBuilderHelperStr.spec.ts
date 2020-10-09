import {ConfigBuilderHelperStr} from "../../../src";

describe("config/ConfigBuilderHelperStr", () => {
  it(`helper name must be "str"`, () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.name).toStrictEqual("str");
  });

  it("must convert boolean", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.processSync(true)).toStrictEqual(`"true"`);
  });

  it("must convert number", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.processSync(3)).toStrictEqual(`"3"`);
  });

  it("must convert string", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.processSync(`"some string"`)).toStrictEqual(
      `"\\"some string\\""`,
    );
  });

  it("must doesn't convert null", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.processSync(null)).toBeNull();
  });

  it("must doesn't convert undefined", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(configBuilderHelperStr.processSync(undefined)).toBeUndefined();
  });

  it("must throw error if more than one value was passed", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(() => configBuilderHelperStr.processSync(true, false)).toThrow(
      "one argument expected, 2 received",
    );
  });

  it("must throw error if no values was passed", () => {
    const configBuilderHelperStr = new ConfigBuilderHelperStr();

    expect(() => configBuilderHelperStr.processSync()).toThrow(
      "one argument expected, 0 received",
    );
  });
});
