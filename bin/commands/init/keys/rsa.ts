import {flags} from "@oclif/command";
import * as Rsa from "node-rsa";

import {BaseCommand} from "../../../cli";

export default class InitKeysRsaCommand extends BaseCommand {
  public static description = "init RSA keys";

  public static flags = {
    ...BaseCommand.flags,
    bits: flags.integer({
      char: "b",
      default: 2048,
      description: "RSA key size in bits",
    }),
    format: flags.enum({
      char: "f",
      default: "pkcs8-pem",
      description: "keys format",
      options: ["pkcs8-pem"],
    }),
  };

  public run(): Promise<void> {
    const {flags} = this.parse(InitKeysRsaCommand);

    const rsa = new Rsa().generateKeyPair(flags.bits);

    switch (flags.format) {
      case "pkcs8-pem":
        {
          this.log(rsa.exportKey("pkcs8-private-pem"));
          this.log(rsa.exportKey("pkcs8-public-pem"));
        }
        break;
    }

    return Promise.resolve();
  }
}
