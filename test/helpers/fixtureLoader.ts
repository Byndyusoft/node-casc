import * as fs from "fs";
import * as path from "path";

export class FixtureLoader {
  private static __fixturesDirName: string = path.resolve(
    __dirname,
    "..",
    "__fixtures__",
  );

  public static loadKey(
    keyFileName: "private.rsa.2048.pkcs8.pem" | "public.rsa.2048.pkcs8.pem",
  ): Promise<string> {
    return fs.promises.readFile(
      path.join(FixtureLoader.__fixturesDirName, "keys", keyFileName),
      "utf8",
    );
  }
}
