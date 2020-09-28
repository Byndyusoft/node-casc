import {dir, DirectoryResult} from "tmp-promise";

import {CascDirInitializer, CommandHelper, RsaHelper} from "../helpers";

describe("bin/ConfigBuildCommand", () => {
  it("must print help", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "config:build",
      "--help",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(CommandHelper.cleanupHelpSync(stdout)).toMatchInlineSnapshot(`
      "build config

      USAGE
        $ casc config:build

      OPTIONS
        -c, --cascDir=cascDir    [default: /app/.casc] CASC directory
        -e, --env=env            (required) environment
        -o, --override=override  [default: true] override values
        -y, --yaml=yaml          [default: false] YAML output instead JSON

      "
    `);
  });

  describe("print config", () => {
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
            production: "value for override",
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

    it("must print config in json format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "config:build",
        "--cascDir",
        tempCascDir.path,
        "--env",
        "production",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "{
          \\"key\\": \\"value\\",
          \\"key_for_override\\": \\"overridden value\\"
        }
        "
      `);
    });

    it("must print config in json format without override", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "config:build",
        "--cascDir",
        tempCascDir.path,
        "--env",
        "production",
        "--override",
        "false",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "{
          \\"key\\": \\"value\\",
          \\"key_for_override\\": \\"value for override\\"
        }
        "
      `);
    });

    it("must print config in yaml format", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "config:build",
        "--cascDir",
        tempCascDir.path,
        "--env",
        "production",
        "--yaml",
        "true",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "key: value
        key_for_override: overridden value

        "
      `);
    });

    it("must print config in yaml format without override", async () => {
      const {exitCode, stderr, stdout} = await CommandHelper.run(
        "config:build",
        "--cascDir",
        tempCascDir.path,
        "--env",
        "production",
        "--yaml",
        "true",
        "--override",
        "false",
      );

      expect(exitCode).toStrictEqual(0);
      expect(stderr).toStrictEqual("");
      expect(stdout).toMatchInlineSnapshot(`
        "key: value
        key_for_override: value for override

        "
      `);
    });
  });
});
