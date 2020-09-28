import {Mock, Times} from "moq.ts";

import {
  ConfigBuilder,
  IConfigBuilderHelper,
  IConfigTemplateReader,
} from "../../../src";

describe("config/ConfigBuilder", () => {
  let configTemplateReaderMock: Mock<IConfigTemplateReader>;

  function buildConfigBuilder(
    ...configBuilderHelpers: readonly IConfigBuilderHelper[]
  ): ConfigBuilder {
    return new ConfigBuilder(
      configBuilderHelpers,
      configTemplateReaderMock.object(),
    );
  }

  beforeEach(() => {
    configTemplateReaderMock = new Mock<IConfigTemplateReader>();
  });

  it("must build config", async () => {
    configTemplateReaderMock
      .setup((i) => i.read())
      .returns(Promise.resolve("key: {{ KEY }}"));

    const configBuilder = buildConfigBuilder();

    expect(
      await configBuilder.build({
        KEY: "value",
      }),
    ).toStrictEqual({
      key: "value",
    });
  });

  it("must invoke helper", async () => {
    configTemplateReaderMock
      .setup((i) => i.read())
      .returns(Promise.resolve("key: {{ name KEY }}"));

    const configBuilderHelperMock = new Mock<IConfigBuilderHelper>()
      .setup((i) => i.name)
      .returns("name")
      .setup((i) => i.processSync("value"))
      .returns("new value");

    const configBuilder = buildConfigBuilder(configBuilderHelperMock.object());

    expect(
      await configBuilder.build({
        KEY: "value",
      }),
    ).toStrictEqual({
      key: "new value",
    });
  });

  it("must not read config template twice", async () => {
    configTemplateReaderMock
      .setup((i) => i.read())
      .returns(Promise.resolve("key: {{ KEY }}"));

    const configBuilder = buildConfigBuilder();

    for (let i = 0; i < 2; ++i) {
      expect(
        await configBuilder.build({
          KEY: "value",
        }),
      ).toStrictEqual({
        key: "value",
      });
    }

    configTemplateReaderMock.verify((i) => i.read(), Times.Once());
  });
});
