import * as Rsa from "node-rsa";

import {CommandHelper} from "../helpers";

describe("bin/InitKeysRsaCommand", () => {
  const privateKeyPattern = /^[\S\s]*-----BEGIN PRIVATE KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PRIVATE KEY-----[\S\s]*$/g;
  const publicKeyPattern = /^[\S\s]*-----BEGIN PUBLIC KEY-----\s*(?=(([A-Za-z0-9+/=]+\s*)+))\1-----END PUBLIC KEY-----[\S\s]*$/g;

  it("must print help", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "init:keys:rsa",
      "--help",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(CommandHelper.cleanupHelpSync(stdout)).toMatchInlineSnapshot(`
      "init RSA keys

      USAGE
        $ casc init:keys:rsa

      OPTIONS
        -b, --bits=bits           [default: 2048] RSA key size in bits
        -c, --cascDir=cascDir     [default: /app/.casc] CASC directory
        -f, --format=(pkcs8-pem)  [default: pkcs8-pem] keys format

      "
    `);
  });

  it("must print keys in pkcs8-pem format", async () => {
    const {exitCode, stderr, stdout} = await CommandHelper.run(
      "init:keys:rsa",
      "--bits",
      "1024",
    );

    expect(exitCode).toStrictEqual(0);
    expect(stderr).toStrictEqual("");
    expect(stdout).toMatch(privateKeyPattern);
    expect(stdout).toMatch(publicKeyPattern);

    const keys = new Rsa(stdout);
    expect(keys.getKeySize()).toStrictEqual(1024);
  }, 30_000);
});
