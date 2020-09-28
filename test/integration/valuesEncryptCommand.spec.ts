import * as yaml from "js-yaml";
import {dir, DirectoryResult} from "tmp-promise";

import {ValuesDto} from "../../src";
import {CascDirInitializer, CommandHelper, RsaHelper} from "../helpers";

describe("bin/ValuesEncryptCommand", () => {
  it("must print help", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "values:encrypt",
      "--help",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(CommandHelper.cleanupHelpSync(stdout)).toMatchInlineSnapshot(`
      "encrypt values

      USAGE
        $ casc values:encrypt

      OPTIONS
        -c, --cascDir=cascDir  [default: /app/.casc] CASC directory
        -y, --yaml=yaml        [default: true] YAML output instead JSON

      "
    `);
  });

  describe("print encrypted values", () => {
    let tempCascDir: DirectoryResult;

    beforeEach(async () => {
      tempCascDir = await dir({unsafeCleanup: true});

      await new CascDirInitializer(tempCascDir.path)
        .withKey("private.pem", "private.rsa.2048.pkcs8.pem")
        .withKey("public.pem", "public.rsa.2048.pkcs8.pem")
        .withConfig({
          key: "{{ KEY }}",
          key_for_override: "{{ KEY_FOR_OVERRIDE }}",
        })
        .withSettings()
        .withValues({
          KEY: {
            "production!": "value",
          },
          KEY_FOR_OVERRIDE: {
            "production!": "value for override",
          },
        })
        .withValuesOverride({
          KEY_FOR_OVERRIDE: {
            default: "overridden value",
          },
        })
        .init();
    });

    afterEach(async () => {
      await tempCascDir.cleanup();
    });

    it("must print encrypted values in yaml format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "values:encrypt",
        "--cascDir",
        tempCascDir.path,
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");

      const encryptedValues = yaml.safeLoad(stdout) as ValuesDto;

      expect(Object.keys(encryptedValues)).toStrictEqual([
        "KEY",
        "KEY_FOR_OVERRIDE",
      ]);
      expect(Object.keys(encryptedValues.KEY)).toStrictEqual(["production*"]);
      expect(
        await RsaHelper.decrypt(encryptedValues.KEY["production*"] as string),
      ).toStrictEqual("value");
      expect(Object.keys(encryptedValues.KEY_FOR_OVERRIDE)).toStrictEqual([
        "production*",
      ]);
      expect(
        await RsaHelper.decrypt(
          encryptedValues.KEY_FOR_OVERRIDE["production*"] as string,
        ),
      ).toStrictEqual("value for override");
    });

    it("must print encrypted values in json format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "values:encrypt",
        "--cascDir",
        tempCascDir.path,
        "--yaml",
        "false",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");

      const encryptedValues = JSON.parse(stdout) as ValuesDto;

      expect(Object.keys(encryptedValues)).toStrictEqual([
        "KEY",
        "KEY_FOR_OVERRIDE",
      ]);
      expect(Object.keys(encryptedValues.KEY)).toStrictEqual(["production*"]);
      expect(
        await RsaHelper.decrypt(encryptedValues.KEY["production*"] as string),
      ).toStrictEqual("value");
      expect(Object.keys(encryptedValues.KEY_FOR_OVERRIDE)).toStrictEqual([
        "production*",
      ]);
      expect(
        await RsaHelper.decrypt(
          encryptedValues.KEY_FOR_OVERRIDE["production*"] as string,
        ),
      ).toStrictEqual("value for override");
    });
  });
});
