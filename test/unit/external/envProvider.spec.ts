import * as fs from "fs";
import * as path from "path";

import {Mock} from "moq.ts";
import {dir, DirectoryResult} from "tmp-promise";

import {EnvProvider, ICascDirProvider} from "../../../src";

describe("external/EnvProvider", () => {
  let cascDirProviderMock: Mock<ICascDirProvider>;
  let tempCascDir: DirectoryResult;

  function buildEnvProvider(): EnvProvider {
    return new EnvProvider(cascDirProviderMock.object());
  }

  beforeEach(async () => {
    cascDirProviderMock = new Mock<ICascDirProvider>();
    tempCascDir = await dir({unsafeCleanup: true});

    cascDirProviderMock.setup((i) => i.cascDir).returns(tempCascDir.path);
  });

  afterEach(async () => {
    await tempCascDir.cleanup();
  });

  it("must read environment variables from .env file", async () => {
    await fs.promises.writeFile(
      path.join(tempCascDir.path, ".env"),
      "KEY=value",
    );

    const envProvider = buildEnvProvider();

    expect(envProvider.env).toMatchObject({KEY: "value", ...process.env});
  });

  it("must return process.env values", () => {
    const envProvider = buildEnvProvider();

    expect(envProvider.env).toStrictEqual(process.env);
  });
});
