import {CascSettingsDtoValidator} from "../../../src";

describe("validation/CascSettingsDtoValidator", () => {
  it("must not throw error for correct data", () => {
    const cascSettingsDtoValidator = new CascSettingsDtoValidator();

    expect(() =>
      cascSettingsDtoValidator.validateSync({
        crypto: {
          strategy: "rsa",
        },
        privateKey: {
          format: "pkcs8-private-pem",
          strategies: {
            file: "private.rsa.2048.pkcs8.pem",
          },
        },
        publicKey: {
          format: "pkcs8-public-pem",
          strategies: {
            file: "public.rsa.2048.pkcs8.pem",
          },
        },
      }),
    ).not.toThrow();
  });

  it("must throw error for wrong data", () => {
    const cascSettingsDtoValidator = new CascSettingsDtoValidator();

    expect(() =>
      cascSettingsDtoValidator.validateSync({
        crypto: {
          strategy: "wrong strategy name with space",
        },
        privateKey: {
          format: "pkcs8-private-pem",
          strategies: {
            file: "private.rsa.2048.pkcs8.pem",
          },
        },
        publicKey: {
          format: "pkcs8-public-pem",
          strategies: {
            file: "public.rsa.2048.pkcs8.pem",
          },
        },
      }),
    ).toThrow(`data/crypto/strategy should match pattern "^[A-Za-z_]\\w*$"`);
  });
});
