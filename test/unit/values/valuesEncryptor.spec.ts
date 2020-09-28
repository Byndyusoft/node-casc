import {Mock} from "moq.ts";

import {IEncryptor, ValuesEncryptor} from "../../../src";
import {RsaHelper} from "../../helpers";

describe("values/ValuesEncryptor", () => {
  let encryptorMock: Mock<IEncryptor>;

  function buildValuesEncryptor(): ValuesEncryptor {
    return new ValuesEncryptor(encryptorMock.object());
  }

  beforeEach(() => {
    encryptorMock = new Mock<IEncryptor>();

    encryptorMock.setup((i) => i.encrypt).returns(RsaHelper.encrypt);
  });

  it("must encrypt decrypted value", async () => {
    const valuesEncryptor = buildValuesEncryptor();

    const encryptedValues = await valuesEncryptor.encrypt({
      key: {
        "production!": "value",
      },
    });

    expect(Object.keys(encryptedValues)).toStrictEqual(["key"]);
    expect(Object.keys(encryptedValues.key)).toStrictEqual(["production*"]);
    expect(
      await RsaHelper.decrypt(encryptedValues.key["production*"] as string),
    ).toStrictEqual("value");
  });

  it("must encrypt decrypted values", async () => {
    const valuesEncryptor = buildValuesEncryptor();

    const encryptedValues = await valuesEncryptor.encrypt({
      key: {
        "production!": ["value 1", "value 2", "value 3"],
      },
    });

    expect(Object.keys(encryptedValues)).toStrictEqual(["key"]);
    expect(Object.keys(encryptedValues.key)).toStrictEqual(["production*"]);
    expect(
      await Promise.all(
        (encryptedValues.key["production*"] as string[]).map((x) =>
          RsaHelper.decrypt(x),
        ),
      ),
    ).toStrictEqual(["value 1", "value 2", "value 3"]);
  });

  it("must skip encrypted value", async () => {
    const encryptedValue = await RsaHelper.encrypt("value");

    const valuesEncryptor = buildValuesEncryptor();

    expect(
      await valuesEncryptor.encrypt({
        key: {
          "production*": encryptedValue,
        },
      }),
    ).toStrictEqual({
      key: {
        "production*": encryptedValue,
      },
    });
  });

  it("must skip public values", async () => {
    const valuesEncryptor = buildValuesEncryptor();

    expect(
      await valuesEncryptor.encrypt({
        key: {
          production: ["value 1", "value 2", "value 3"],
        },
      }),
    ).toStrictEqual({
      key: {
        production: ["value 1", "value 2", "value 3"],
      },
    });
  });
});
