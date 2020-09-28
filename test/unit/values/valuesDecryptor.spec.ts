import {Mock} from "moq.ts";

import {IDecryptor, ValuesDecryptor} from "../../../src";
import {RsaHelper} from "../../helpers";

describe("values/ValuesDecryptor", () => {
  let decryptorMock: Mock<IDecryptor>;

  function buildValuesDecryptor(): ValuesDecryptor {
    return new ValuesDecryptor(decryptorMock.object());
  }

  beforeEach(() => {
    decryptorMock = new Mock<IDecryptor>();

    decryptorMock.setup((i) => i.decrypt).returns(RsaHelper.decrypt);
  });

  it("must decrypt encrypted value", async () => {
    const valuesDecryptor = buildValuesDecryptor();

    expect(
      await valuesDecryptor.decrypt({
        key: {
          "production*": await RsaHelper.encrypt("value"),
        },
      }),
    ).toStrictEqual({
      key: {
        "production!": "value",
      },
    });
  });

  it("must decrypt encrypted values", async () => {
    const valuesDecryptor = buildValuesDecryptor();

    expect(
      await valuesDecryptor.decrypt({
        key: {
          "production*": [
            await RsaHelper.encrypt("value 1"),
            await RsaHelper.encrypt("value 2"),
            await RsaHelper.encrypt("value 3"),
          ],
        },
      }),
    ).toStrictEqual({
      key: {
        "production!": ["value 1", "value 2", "value 3"],
      },
    });
  });

  it("must skip decrypted value", async () => {
    const valuesDecryptor = buildValuesDecryptor();

    expect(
      await valuesDecryptor.decrypt({
        key: {
          "production!": "value",
        },
      }),
    ).toStrictEqual({
      key: {
        "production!": "value",
      },
    });
  });

  it("must skip public values", async () => {
    const valuesDecryptor = buildValuesDecryptor();

    expect(
      await valuesDecryptor.decrypt({
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
