import * as path from "path";

import {It, Mock} from "moq.ts";

import {
  CascSettings,
  CascSettingsDto,
  ICascDirProvider,
  ICascSettingsDtoValidator,
  IFsProvider,
} from "../../../src";

describe("cascSettings/CascSettings", () => {
  const cascDir = path.join("/", "app", ".casc");
  const cascSettingsFileName = path.join(cascDir, "settings.yaml");

  let cascDirProviderMock: Mock<ICascDirProvider>;
  let cascSettingsDtoValidatorMock: Mock<ICascSettingsDtoValidator>;
  let fsProviderMock: Mock<IFsProvider>;

  function buildCascSettings(): CascSettings {
    return new CascSettings(
      cascDirProviderMock.object(),
      cascSettingsDtoValidatorMock.object(),
      fsProviderMock.object(),
    );
  }

  beforeEach(() => {
    cascDirProviderMock = new Mock<ICascDirProvider>();
    cascSettingsDtoValidatorMock = new Mock<ICascSettingsDtoValidator>();
    fsProviderMock = new Mock<IFsProvider>();

    cascDirProviderMock.setup((i) => i.cascDir).returns(cascDir);
    cascSettingsDtoValidatorMock
      .setup((i) => i.validateSync(It.IsAny()))
      .returns();
  });

  it("must read settings", () => {
    fsProviderMock
      .setup((i) => i.readYamlSync<CascSettingsDto>(cascSettingsFileName))
      .returns({
        crypto: {
          strategy: "cryptoStrategy",
        },
        privateKey: {
          format: "private format",
          strategies: {
            privateStrategy: "private settings",
          },
        },
        publicKey: {
          format: "public format",
          strategies: {
            publicStrategy: "public settings",
          },
        },
      });

    const cascSettings = buildCascSettings();

    expect(cascSettings.cryptoStrategy).toStrictEqual("cryptoStrategy");
    expect(cascSettings.privateKeyFormat).toStrictEqual("private format");
    expect(cascSettings.privateKeyReadingStrategies).toStrictEqual([
      "privateStrategy",
    ]);
    expect(cascSettings.publicKeyFormat).toStrictEqual("public format");
    expect(cascSettings.publicKeyReadingStrategies).toStrictEqual([
      "publicStrategy",
    ]);
    expect(
      cascSettings.getKeyReadingStrategySettingsSync(
        "private",
        "privateStrategy",
      ),
    ).toStrictEqual("private settings");
    expect(
      cascSettings.getKeyReadingStrategySettingsSync(
        "public",
        "publicStrategy",
      ),
    ).toStrictEqual("public settings");
  });

  it("must throw error if settings are invalid", () => {
    cascSettingsDtoValidatorMock
      .setup((i) => i.validateSync(It.IsAny()))
      .throws(new Error("invalid settings"));
    fsProviderMock
      .setup((i) => i.readYamlSync<CascSettingsDto>(cascSettingsFileName))
      .returns({
        crypto: {
          strategy: "crypto strategy",
        },
        privateKey: {
          format: "private format",
          strategies: {
            privateStrategy: "private settings",
          },
        },
        publicKey: {
          format: "public format",
          strategies: {
            publicStrategy: "public settings",
          },
        },
      });

    expect(() => buildCascSettings()).toThrow("invalid settings");
  });
});
