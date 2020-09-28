import * as Rsa from "node-rsa";

import {FixtureLoader} from "./fixtureLoader";

export class RsaHelper {
  public static async decrypt(
    encryptedValue: string,
    keyFileName: "private.rsa.2048.pkcs8.pem" = "private.rsa.2048.pkcs8.pem",
  ): Promise<string> {
    const privateKey = new Rsa(
      await FixtureLoader.loadKey(keyFileName),
      "pkcs8-private-pem",
    );

    return privateKey.decrypt(encryptedValue, "utf8");
  }

  public static async encrypt(
    value: string,
    keyFileName: "public.rsa.2048.pkcs8.pem" = "public.rsa.2048.pkcs8.pem",
  ): Promise<string> {
    const publicKey = new Rsa(
      await FixtureLoader.loadKey(keyFileName),
      "pkcs8-public-pem",
    );

    return publicKey.encrypt(value, "base64");
  }
}
