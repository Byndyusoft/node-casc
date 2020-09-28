import * as path from "path";

import {Mock} from "moq.ts";

import {
  ConfigTemplateReader,
  ICascDirProvider,
  IFsProvider,
} from "../../../src";

describe("config/ConfigTemplateReader", () => {
  const cascDir = path.join("/", "app", ".casc");
  const configTemplateFileName = path.join(cascDir, "config.yaml");

  let cascDirProviderMock: Mock<ICascDirProvider>;
  let fsProviderMock: Mock<IFsProvider>;

  function buildConfigTemplateReader(): ConfigTemplateReader {
    return new ConfigTemplateReader(
      cascDirProviderMock.object(),
      fsProviderMock.object(),
    );
  }

  beforeEach(() => {
    cascDirProviderMock = new Mock<ICascDirProvider>();
    fsProviderMock = new Mock<IFsProvider>();

    cascDirProviderMock.setup((i) => i.cascDir).returns(cascDir);
  });

  it("must read config", async () => {
    fsProviderMock
      .setup((i) => i.readText(configTemplateFileName))
      .returns(Promise.resolve("key: {{ KEY }}"));

    const configTemplateReader = buildConfigTemplateReader();

    expect(await configTemplateReader.read()).toStrictEqual("key: {{ KEY }}");
  });
});
