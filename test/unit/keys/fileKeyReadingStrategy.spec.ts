import * as path from "path";

import {It, Mock} from "moq.ts";

import {
  FileKeyReadingStrategy,
  FilePrivateKeyReadingStrategy,
  FilePublicKeyReadingStrategy,
  ICascDirProvider,
  ICascSettings,
  IFsProvider,
  IKeyPathsDtoValidator,
  KeyPathsDto,
  TKeyType,
} from "../../../src";

describe("keys/FileKeyReadingStrategy", () => {
  const cascDir = path.join("/", "app", ".casc");

  let cascDirProviderMock: Mock<ICascDirProvider>;
  let cascSettingsMock: Mock<ICascSettings>;
  let fsProviderMock: Mock<IFsProvider>;
  let keyPathsDtoValidator: Mock<IKeyPathsDtoValidator>;

  function buildFileKeyReadingStrategy(
    keyType: TKeyType,
  ): FileKeyReadingStrategy {
    switch (keyType) {
      case "private":
        return new FilePrivateKeyReadingStrategy(
          cascDirProviderMock.object(),
          cascSettingsMock.object(),
          fsProviderMock.object(),
          keyPathsDtoValidator.object(),
        );
      case "public":
        return new FilePublicKeyReadingStrategy(
          cascDirProviderMock.object(),
          cascSettingsMock.object(),
          fsProviderMock.object(),
          keyPathsDtoValidator.object(),
        );
    }
  }

  beforeEach(() => {
    cascDirProviderMock = new Mock<ICascDirProvider>();
    cascSettingsMock = new Mock<ICascSettings>();
    fsProviderMock = new Mock<IFsProvider>();
    keyPathsDtoValidator = new Mock<IKeyPathsDtoValidator>();

    cascDirProviderMock.setup((i) => i.cascDir).returns(cascDir);
    keyPathsDtoValidator.setup((i) => i.validateSync(It.IsAny())).returns();
  });

  ["private" as TKeyType, "public" as TKeyType].forEach((keyType) => {
    describe(`${keyType}`, () => {
      const absoluteKeyFileName = path.join("/", "keys", `${keyType}.pem`);
      const relativeKeyFileName = path.join(cascDir, "keys", `${keyType}.pem`);

      it("must read key from 1st absolute key path", async () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<KeyPathsDto>(keyType, "file"),
          )
          .returns(absoluteKeyFileName);
        fsProviderMock
          .setup((i) => i.hasReadAccess(absoluteKeyFileName))
          .returns(Promise.resolve(true))
          .setup((i) => i.readText(absoluteKeyFileName))
          .returns(Promise.resolve("key"));

        const fileKeyReadingStrategy = buildFileKeyReadingStrategy(keyType);

        expect(await fileKeyReadingStrategy.tryRead()).toStrictEqual("key");
      });

      it("must read key from 1st relative key path", async () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<KeyPathsDto>(keyType, "file"),
          )
          .returns(`${keyType}.pem`);
        fsProviderMock
          .setup((i) => i.hasReadAccess(relativeKeyFileName))
          .returns(Promise.resolve(true))
          .setup((i) => i.readText(relativeKeyFileName))
          .returns(Promise.resolve("key"));

        const fileKeyReadingStrategy = buildFileKeyReadingStrategy(keyType);

        expect(await fileKeyReadingStrategy.tryRead()).toStrictEqual("key");
      });

      it("must read key from 2nd key path", async () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<KeyPathsDto>(keyType, "file"),
          )
          .returns([`${keyType}.pem`, absoluteKeyFileName]);
        fsProviderMock
          .setup((i) => i.hasReadAccess(relativeKeyFileName))
          .returns(Promise.resolve(false))
          .setup((i) => i.hasReadAccess(absoluteKeyFileName))
          .returns(Promise.resolve(true))
          .setup((i) => i.readText(absoluteKeyFileName))
          .returns(Promise.resolve("key"));

        const fileKeyReadingStrategy = buildFileKeyReadingStrategy(keyType);

        expect(await fileKeyReadingStrategy.tryRead()).toStrictEqual("key");
      });

      it("must return null if key can't be found", async () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<KeyPathsDto>(keyType, "file"),
          )
          .returns(`${keyType}.pem`);
        fsProviderMock
          .setup((i) => i.hasReadAccess(relativeKeyFileName))
          .returns(Promise.resolve(false));

        const fileKeyReadingStrategy = buildFileKeyReadingStrategy(keyType);

        expect(await fileKeyReadingStrategy.tryRead()).toBeNull();
      });

      it("must throw error if settings are invalid", () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<null>(keyType, "file"),
          )
          .returns(null);
        keyPathsDtoValidator
          .setup((i) => i.validateSync(It.IsAny()))
          .throws(new Error("invalid settings"));

        expect(() => buildFileKeyReadingStrategy(keyType)).toThrow(
          "invalid settings",
        );
      });

      it(`strategy name must be "file"`, () => {
        cascSettingsMock
          .setup((i) =>
            i.getKeyReadingStrategySettingsSync<KeyPathsDto>(keyType, "file"),
          )
          .returns([]);

        const fileKeyReadingStrategy = buildFileKeyReadingStrategy(keyType);

        expect(fileKeyReadingStrategy.name).toStrictEqual("file");
      });
    });
  });
});
