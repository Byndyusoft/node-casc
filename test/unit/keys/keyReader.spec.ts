import {Mock} from "moq.ts";

import {
  ICascSettings,
  IKeyReadingStrategy,
  KeyReader,
  PrivateKeyReader,
  PublicKeyReader,
  TKeyType,
} from "../../../src";

describe("keys/KeyReader", () => {
  let cascSettingsMock: Mock<ICascSettings>;

  function buildKeyReader(
    keyType: TKeyType,
    ...keyReadingStrategies: readonly IKeyReadingStrategy[]
  ): KeyReader {
    switch (keyType) {
      case "private":
        return new PrivateKeyReader(
          cascSettingsMock.object(),
          keyReadingStrategies,
        );
      case "public":
        return new PublicKeyReader(
          cascSettingsMock.object(),
          keyReadingStrategies,
        );
    }
  }

  function setupKeyReadingStrategies(
    keyType: string,
    ...keyReadingStrategies: readonly string[]
  ): void {
    switch (keyType) {
      case "private":
        cascSettingsMock
          .setup((i) => i.privateKeyReadingStrategies)
          .returns(keyReadingStrategies);
        break;
      case "public":
        cascSettingsMock
          .setup((i) => i.publicKeyReadingStrategies)
          .returns(keyReadingStrategies);
        break;
    }
  }

  beforeEach(() => {
    cascSettingsMock = new Mock<ICascSettings>();
  });

  ["private" as TKeyType, "public" as TKeyType].forEach((keyType) => {
    describe(`${keyType}`, () => {
      it("must get key from 1st strategy", async () => {
        setupKeyReadingStrategies(keyType, "name");

        const keyReadingStrategy = new Mock<IKeyReadingStrategy>()
          .setup((i) => i.name)
          .returns("name")
          .setup((i) => i.tryRead())
          .returns(Promise.resolve("key"));

        const keyReader = buildKeyReader(keyType, keyReadingStrategy.object());

        expect(await keyReader.read()).toStrictEqual("key");
      });

      it("must get key from 2nd strategy", async () => {
        setupKeyReadingStrategies(keyType, "name1", "name2");

        const keyReadingStrategy1 = new Mock<IKeyReadingStrategy>()
          .setup((i) => i.name)
          .returns("name1")
          .setup((i) => i.tryRead())
          .returns(Promise.resolve(null));
        const keyReadingStrategy2 = new Mock<IKeyReadingStrategy>()
          .setup((i) => i.name)
          .returns("name2")
          .setup((i) => i.tryRead())
          .returns(Promise.resolve("key"));

        const keyReader = buildKeyReader(
          keyType,
          keyReadingStrategy1.object(),
          keyReadingStrategy2.object(),
        );

        expect(await keyReader.read()).toStrictEqual("key");
      });

      it("must throw error if key can't be found", async () => {
        setupKeyReadingStrategies(keyType, "name");

        const keyReadingStrategy = new Mock<IKeyReadingStrategy>()
          .setup((i) => i.name)
          .returns("name")
          .setup((i) => i.tryRead())
          .returns(Promise.resolve(null));

        const keyReader = buildKeyReader(keyType, keyReadingStrategy.object());

        await expect(keyReader.read()).rejects.toThrow(
          `${keyType} key reader can't find key`,
        );
      });

      it("must throw error if strategy doesn't exists", async () => {
        setupKeyReadingStrategies(keyType, "unknown");

        const keyReader = buildKeyReader(keyType);

        await expect(keyReader.read()).rejects.toThrow(
          `${keyType} key reading strategy "unknown" doesn't exists`,
        );
      });
    });
  });
});
