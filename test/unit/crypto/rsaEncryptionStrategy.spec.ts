import {Mock, Times} from "moq.ts";

import {
  ICascSettings,
  IPublicKeyReader,
  RsaEncryptionStrategy,
} from "../../../src";
import {FixtureLoader, RsaHelper} from "../../helpers";

describe("crypto/RsaEncryptionStrategy", () => {
  let cascSettings: Mock<ICascSettings>;
  let publicKeyReader: Mock<IPublicKeyReader>;

  function buildRsaEncryptionStrategy(): RsaEncryptionStrategy {
    return new RsaEncryptionStrategy(
      cascSettings.object(),
      publicKeyReader.object(),
    );
  }

  beforeEach(() => {
    cascSettings = new Mock<ICascSettings>();
    publicKeyReader = new Mock<IPublicKeyReader>();

    cascSettings.setup((i) => i.publicKeyFormat).returns("pkcs8-public-pem");
    publicKeyReader
      .setup((i) => i.read())
      .returns(FixtureLoader.loadKey("public.rsa.2048.pkcs8.pem"));
  });

  it("must encrypt value", async () => {
    const rsaEncryptionStrategy = buildRsaEncryptionStrategy();

    expect(
      await RsaHelper.decrypt(await rsaEncryptionStrategy.encrypt("value")),
    ).toStrictEqual("value");
  });

  it("must not read public key twice", async () => {
    const rsaEncryptionStrategy = buildRsaEncryptionStrategy();

    for (let i = 0; i < 2; ++i) {
      expect(
        await RsaHelper.decrypt(
          await rsaEncryptionStrategy.encrypt(`value${i.toString()}`),
        ),
      ).toStrictEqual(`value${i.toString()}`);
    }

    publicKeyReader.verify((i) => i.read(), Times.Once());
  });

  it("must throw error if public key has unsupported format", async () => {
    cascSettings.setup((i) => i.publicKeyFormat).returns("public");

    const rsaEncryptionStrategy = buildRsaEncryptionStrategy();

    await expect(rsaEncryptionStrategy.encrypt("")).rejects.toThrow(
      "unsupported public key format",
    );
  });

  it(`strategy name must be "rsa"`, () => {
    const rsaEncryptionStrategy = buildRsaEncryptionStrategy();

    expect(rsaEncryptionStrategy.name).toStrictEqual("rsa");
  });
});
