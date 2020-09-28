import {KeyPathsDtoValidator} from "../../../src";

describe("validation/KeyPathsDtoValidator", () => {
  it("must not throw error for correct data", () => {
    const keyPathsDtoValidator = new KeyPathsDtoValidator();

    expect(() =>
      keyPathsDtoValidator.validateSync("private.rsa.2048.pkcs8.pem"),
    ).not.toThrow();
  });
});
