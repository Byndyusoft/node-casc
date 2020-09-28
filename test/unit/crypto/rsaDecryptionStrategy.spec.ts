import {Mock, Times} from "moq.ts";

import {
  ICascSettings,
  IPrivateKeyReader,
  RsaDecryptionStrategy,
} from "../../../src";
import {FixtureLoader, RsaHelper} from "../../helpers";

describe("crypto/RsaDecryptionStrategy", () => {
  let cascSettings: Mock<ICascSettings>;
  let privateKeyReader: Mock<IPrivateKeyReader>;

  function buildRsaDecryptionStrategy(): RsaDecryptionStrategy {
    return new RsaDecryptionStrategy(
      cascSettings.object(),
      privateKeyReader.object(),
    );
  }

  beforeEach(() => {
    cascSettings = new Mock<ICascSettings>();
    privateKeyReader = new Mock<IPrivateKeyReader>();

    cascSettings.setup((i) => i.privateKeyFormat).returns("pkcs8-private-pem");
    privateKeyReader
      .setup((i) => i.read())
      .returns(FixtureLoader.loadKey("private.rsa.2048.pkcs8.pem"));
  });

  it("must decrypt value", async () => {
    const rsaDecryptionStrategy = buildRsaDecryptionStrategy();

    expect(
      await rsaDecryptionStrategy.decrypt(await RsaHelper.encrypt("value")),
    ).toStrictEqual("value");
  });

  it("must not read private key twice", async () => {
    const rsaDecryptionStrategy = buildRsaDecryptionStrategy();

    for (let i = 0; i < 2; ++i) {
      expect(
        await rsaDecryptionStrategy.decrypt(
          await RsaHelper.encrypt(`value${i.toString()}`),
        ),
      ).toStrictEqual(`value${i.toString()}`);
    }

    privateKeyReader.verify((i) => i.read(), Times.Once());
  });

  it("must throw error if private key has unsupported format", async () => {
    cascSettings.setup((i) => i.privateKeyFormat).returns("private");

    const rsaDecryptionStrategy = buildRsaDecryptionStrategy();

    await expect(rsaDecryptionStrategy.decrypt("")).rejects.toThrow(
      "unsupported private key format",
    );
  });

  it(`strategy name must be "rsa"`, () => {
    const rsaDecryptionStrategy = buildRsaDecryptionStrategy();

    expect(rsaDecryptionStrategy.name).toStrictEqual("rsa");
  });
});
