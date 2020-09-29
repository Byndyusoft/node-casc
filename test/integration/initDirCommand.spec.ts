import * as fs from "fs";
import * as path from "path";

import {CLIError} from "@oclif/errors";
import {dir, DirectoryResult} from "tmp-promise";

import {CommandHelper} from "../helpers";

describe("bin/InitDirCommand", () => {
  it("must print help", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "init:dir",
      "--help",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(CommandHelper.cleanupHelpSync(stdout)).toMatchInlineSnapshot(`
      "init CASC directory

      USAGE
        $ casc init:dir

      OPTIONS
        -c, --cascDir=cascDir  [default: /app/.casc] CASC directory

      "
    `);
  });

  describe("init dir", () => {
    let tempCascDir: DirectoryResult;

    beforeEach(async () => {
      tempCascDir = await dir({unsafeCleanup: true});
    });

    afterEach(async () => {
      await tempCascDir.cleanup();
    });

    it("must init dir", async () => {
      const cascDir = path.join(tempCascDir.path, ".casc");

      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "init:dir",
        "--cascDir",
        cascDir,
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toStrictEqual("");

      [
        "",
        "keys",
        ".env",
        "config.yaml",
        "settings.yaml",
        "values.yaml",
        "values.override.yaml",
      ].forEach((x) =>
        expect(fs.existsSync(path.join(cascDir, x))).toStrictEqual(true),
      );

      expect(
        await fs.promises.readFile(path.join(cascDir, "settings.yaml"), "utf8"),
      ).toMatchInlineSnapshot(`
        "crypto:
          strategy: rsa
        privateKey:
          format: pkcs8-private-pem
          strategies:
            file: private.pem
            env: CASC_PRIVATE_KEY
        publicKey:
          format: pkcs8-public-pem
          strategies:
            file: public.pem
        "
      `);
    });

    it("must print warnings if files already exists", async () => {
      const bang = new CLIError.Warn("").bang.replace(/[^»›]/g, "");
      const cascDir = path.join(tempCascDir.path, ".casc");

      const {
        exitCode: exitCode1,
        stderr: stderr1,
        stdout: stdout1,
      } = await CommandHelper.run("init:dir", "--cascDir", cascDir);

      expect(exitCode1).toStrictEqual(0);
      expect(stderr1).toStrictEqual("");
      expect(stdout1).toStrictEqual("");

      const {
        exitCode: exitCode2,
        stderr: stderr2,
        stdout: stdout2,
      } = await CommandHelper.run("init:dir", "--cascDir", cascDir);

      expect(exitCode2).toStrictEqual(0);
      expect(stderr2).toStrictEqual("");

      // eslint-disable-next-line jest/no-interpolation-in-snapshots
      expect(CommandHelper.cleanupHelpSync(stdout2)).toMatchInlineSnapshot(`
        " ${bang}   Warning: /app/.casc already exists
         ${bang}   Warning: /app/.casc/keys already exists
         ${bang}   Warning: /app/.casc/.env already exists
         ${bang}   Warning: /app/.casc/config.yaml already exists
         ${bang}   Warning: /app/.casc/settings.yaml already exists
         ${bang}   Warning: /app/.casc/values.yaml already exists
         ${bang}   Warning: /app/.casc/values.override.yaml already exists
        "
      `);
    });
  });
});
