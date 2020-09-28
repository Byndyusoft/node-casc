import {It, Mock} from "moq.ts";

import {
  EnvPrivateKeyReadingStrategy,
  ICascSettings,
  IEnvProvider,
  IKeyPathsDtoValidator,
  KeyPathsDto,
} from "../../../src";

describe("keys/EnvPrivateKeyReadingStrategy", () => {
  let cascSettingsMock: Mock<ICascSettings>;
  let envProviderMock: Mock<IEnvProvider>;
  let keyPathsDtoValidator: Mock<IKeyPathsDtoValidator>;

  function buildEnvPrivateKeyReadingStrategy(): EnvPrivateKeyReadingStrategy {
    return new EnvPrivateKeyReadingStrategy(
      cascSettingsMock.object(),
      envProviderMock.object(),
      keyPathsDtoValidator.object(),
    );
  }

  beforeEach(() => {
    cascSettingsMock = new Mock<ICascSettings>();
    envProviderMock = new Mock<IEnvProvider>();
    keyPathsDtoValidator = new Mock<IKeyPathsDtoValidator>();

    keyPathsDtoValidator.setup((i) => i.validateSync(It.IsAny())).returns();
  });

  it("must read private key from 1st key path", async () => {
    cascSettingsMock
      .setup((i) =>
        i.getKeyReadingStrategySettingsSync<KeyPathsDto>("private", "env"),
      )
      .returns("key");
    envProviderMock.setup((i) => i.env).returns({key: "value"});

    const envPrivateKeyReadingStrategy = buildEnvPrivateKeyReadingStrategy();

    expect(await envPrivateKeyReadingStrategy.tryRead()).toStrictEqual("value");
  });

  it("must read private key from 2nd key path", async () => {
    cascSettingsMock
      .setup((i) =>
        i.getKeyReadingStrategySettingsSync<KeyPathsDto>("private", "env"),
      )
      .returns(["key1", "key2"]);
    envProviderMock.setup((i) => i.env).returns({key2: "value 2"});

    const envPrivateKeyReadingStrategy = buildEnvPrivateKeyReadingStrategy();

    expect(await envPrivateKeyReadingStrategy.tryRead()).toStrictEqual(
      "value 2",
    );
  });

  it("must return null if key can't be found", async () => {
    cascSettingsMock
      .setup((i) =>
        i.getKeyReadingStrategySettingsSync<KeyPathsDto>("private", "env"),
      )
      .returns("key");
    envProviderMock.setup((i) => i.env).returns({});

    const envPrivateKeyReadingStrategy = buildEnvPrivateKeyReadingStrategy();

    expect(await envPrivateKeyReadingStrategy.tryRead()).toBeNull();
  });

  it("must throw error if settings are invalid", () => {
    cascSettingsMock
      .setup((i) => i.getKeyReadingStrategySettingsSync<null>("private", "env"))
      .returns(null);
    keyPathsDtoValidator
      .setup((i) => i.validateSync(It.IsAny()))
      .throws(new Error("invalid settings"));

    expect(() => buildEnvPrivateKeyReadingStrategy()).toThrow(
      "invalid settings",
    );
  });

  it(`strategy name must be "env"`, () => {
    cascSettingsMock
      .setup((i) =>
        i.getKeyReadingStrategySettingsSync<KeyPathsDto>("private", "env"),
      )
      .returns([]);

    const envPrivateKeyReadingStrategy = buildEnvPrivateKeyReadingStrategy();

    expect(envPrivateKeyReadingStrategy.name).toStrictEqual("env");
  });
});
