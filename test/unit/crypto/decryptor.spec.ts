import {Mock} from "moq.ts";

import {Decryptor, ICascSettings, IDecryptionStrategy} from "../../../src";
import {RsaHelper} from "../../helpers";

describe("crypto/Decryptor", () => {
  let cascSettingsMock: Mock<ICascSettings>;

  function buildDecryptor(
    ...decryptionStrategies: readonly IDecryptionStrategy[]
  ): Decryptor {
    return new Decryptor(cascSettingsMock.object(), decryptionStrategies);
  }

  beforeEach(() => {
    cascSettingsMock = new Mock<ICascSettings>();
  });

  it("must select right decryption strategy", async () => {
    const value = "value";
    const encryptedValue = await RsaHelper.encrypt(value);

    cascSettingsMock.setup((i) => i.cryptoStrategy).returns("name2");

    const decryptionStrategy1 = new Mock<IDecryptionStrategy>()
      .setup((i) => i.name)
      .returns("name1");
    const decryptionStrategy2 = new Mock<IDecryptionStrategy>()
      .setup((i) => i.name)
      .returns("name2")
      .setup((i) => i.decrypt(encryptedValue))
      .returns(Promise.resolve(value));

    const decryptor = buildDecryptor(
      decryptionStrategy1.object(),
      decryptionStrategy2.object(),
    );

    expect(await decryptor.decrypt(encryptedValue)).toStrictEqual(value);
  });

  it("must throw error if decryption strategy doesn't exists", () => {
    cascSettingsMock.setup((i) => i.cryptoStrategy).returns("unknown");

    expect(buildDecryptor).toThrow("No matching element was found");
  });
});
