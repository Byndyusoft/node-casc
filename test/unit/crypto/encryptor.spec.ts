import {Mock} from "moq.ts";

import {Encryptor, ICascSettings, IEncryptionStrategy} from "../../../src";
import {RsaHelper} from "../../helpers";

describe("crypto/Decryptor", () => {
  let cascSettingsMock: Mock<ICascSettings>;

  function buildEncryptor(
    ...encryptionStrategies: readonly IEncryptionStrategy[]
  ): Encryptor {
    return new Encryptor(cascSettingsMock.object(), encryptionStrategies);
  }

  beforeEach(() => {
    cascSettingsMock = new Mock<ICascSettings>();
  });

  it("must select right encryption strategy", async () => {
    const value = "value";
    const encryptedValue = await RsaHelper.encrypt(value);

    cascSettingsMock.setup((i) => i.cryptoStrategy).returns("name2");

    const decryptionStrategy1 = new Mock<IEncryptionStrategy>()
      .setup((i) => i.name)
      .returns("name1");
    const decryptionStrategy2 = new Mock<IEncryptionStrategy>()
      .setup((i) => i.name)
      .returns("name2")
      .setup((i) => i.encrypt(value))
      .returns(Promise.resolve(encryptedValue));

    const encryptor = buildEncryptor(
      decryptionStrategy1.object(),
      decryptionStrategy2.object(),
    );

    expect(await encryptor.encrypt(value)).toStrictEqual(encryptedValue);
  });

  it("must throw error if encryption strategy doesn't exists", () => {
    cascSettingsMock.setup((i) => i.cryptoStrategy).returns("unknown");

    expect(buildEncryptor).toThrow("No matching element was found");
  });
});
