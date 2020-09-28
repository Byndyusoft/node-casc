import {ValuesDtoValidator} from "../../../src";

describe("validation/ValuesDtoValidator", () => {
  it("must not throw error for correct data", () => {
    const valuesDtoValidator = new ValuesDtoValidator();

    expect(() =>
      valuesDtoValidator.validateSync({
        key: {
          production: "value",
        },
      }),
    ).not.toThrow();
  });

  it("must throw error for wrong data", () => {
    const valuesDtoValidator = new ValuesDtoValidator();

    expect(() =>
      valuesDtoValidator.validateSync({
        key: {
          "wrong environment name with space": "value",
        },
      }),
    ).toThrow(`data['key'] should NOT have additional properties`);
  });
});
