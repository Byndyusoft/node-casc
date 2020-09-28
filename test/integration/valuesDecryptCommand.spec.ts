import {dir, DirectoryResult} from "tmp-promise";

import {CascDirInitializer, CommandHelper, RsaHelper} from "../helpers";

describe("bin/ValuesDecryptCommand", () => {
  it("must print help", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "values:decrypt",
      "--help",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(CommandHelper.cleanupHelpSync(stdout)).toMatchInlineSnapshot(`
      "decrypt values

      USAGE
        $ casc values:decrypt

      OPTIONS
        -c, --cascDir=cascDir  [default: /app/.casc] CASC directory
        -y, --yaml=yaml        [default: true] YAML output instead JSON

      "
    `);
  });

  describe("print decrypted values", () => {
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
            "production*": await RsaHelper.encrypt("value"),
          },
          KEY_FOR_OVERRIDE: {
            "production*": await RsaHelper.encrypt("value for override"),
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

    it("must print decrypted values in yaml format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "values:decrypt",
        "--cascDir",
        tempCascDir.path,
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "KEY:
          production!: value
        KEY_FOR_OVERRIDE:
          production!: value for override

        "
      `);
    });

    it("must print decrypted values in json format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "values:decrypt",
        "--cascDir",
        tempCascDir.path,
        "--yaml",
        "false",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "{
          \\"KEY\\": {
            \\"production!\\": \\"value\\"
          },
          \\"KEY_FOR_OVERRIDE\\": {
            \\"production!\\": \\"value for override\\"
          }
        }
        "
      `);
    });
  });
});
