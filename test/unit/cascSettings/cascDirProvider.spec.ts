import * as path from "path";

import {CascDirProvider} from "../../../src";

describe("cascSettings/CascDirProvider", () => {
  const appDir = path.join("/", "app");

  let processCwdMock: jest.SpyInstance;

  beforeEach(() => {
    processCwdMock = jest.spyOn(process, "cwd").mockReturnValue(appDir);
  });

  afterEach(() => {
    processCwdMock.mockRestore();
  });

  it("must change default cascDir", () => {
    const cascDir = path.join("/", "usr", "app", ".casc");

    const cascDirProvider = new CascDirProvider();
    cascDirProvider.cascDir = cascDir;

    expect(cascDirProvider.cascDir).toStrictEqual(cascDir);
  });

  it("must return default cascDir", () => {
    const cascDirProvider = new CascDirProvider();

    expect(cascDirProvider.cascDir).toStrictEqual(path.join(appDir, ".casc"));
  });
});
