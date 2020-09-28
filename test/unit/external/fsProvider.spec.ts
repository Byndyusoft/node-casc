import * as fs from "fs";

import {file, FileResult} from "tmp-promise";

import {FsProvider} from "../../../src";

describe("external/FsProvider", () => {
  let tempFile: FileResult;

  beforeEach(async () => {
    tempFile = await file();
  });

  afterEach(async () => {
    if (fs.existsSync(tempFile.path)) {
      await tempFile.cleanup();
    }
  });

  it("must read text", async () => {
    await fs.promises.writeFile(tempFile.path, "value");

    const fsProvider = new FsProvider();

    expect(await fsProvider.readText(tempFile.path)).toStrictEqual("value");
  });

  it("must read text sync", async () => {
    await fs.promises.writeFile(tempFile.path, "value");

    const fsProvider = new FsProvider();

    expect(fsProvider.readTextSync(tempFile.path)).toStrictEqual("value");
  });

  it("must read yaml", async () => {
    await fs.promises.writeFile(tempFile.path, "key: value");

    const fsProvider = new FsProvider();

    expect(await fsProvider.readYaml(tempFile.path)).toStrictEqual({
      key: "value",
    });
  });

  it("must read yaml sync", async () => {
    await fs.promises.writeFile(tempFile.path, "key: value");

    const fsProvider = new FsProvider();

    expect(fsProvider.readYamlSync(tempFile.path)).toStrictEqual({
      key: "value",
    });
  });

  it("must return false if file are not readable", async () => {
    await tempFile.cleanup();

    const fsProvider = new FsProvider();

    expect(await fsProvider.hasReadAccess(tempFile.path)).toStrictEqual(false);
  });

  it("must return true if file are readable", async () => {
    const fsProvider = new FsProvider();

    expect(await fsProvider.hasReadAccess(tempFile.path)).toStrictEqual(true);
  });
});
