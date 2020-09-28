import * as fs from "fs";
import * as path from "path";

import * as yaml from "js-yaml";

import {CascSettingsDto} from "../../../src";
import {BaseCommand} from "../../cli";

export default class InitDirCommand extends BaseCommand {
  public static description = "init CASC directory";

  public static flags = {
    ...BaseCommand.flags,
  };

  public async run(): Promise<void> {
    await this.__createDir();
    await this.__createDir("keys");
    await this.__createFile(".env");
    await this.__createFile("config.yaml");
    await this.__createSettings();
    await this.__createFile("values.yaml");
    await this.__createFile("values.override.yaml");
  }

  private async __createDir(baseDirName?: string): Promise<void> {
    const dirName = path.join(this._cascDir, baseDirName ?? "");
    if (fs.existsSync(dirName)) {
      this.logWarn(`${dirName} already exists`);
      return;
    }

    await fs.promises.mkdir(dirName, {recursive: true});
  }

  private async __createFile(
    baseFileName: string,
    content = "",
  ): Promise<void> {
    const fileName = path.join(this._cascDir, baseFileName);
    if (fs.existsSync(fileName)) {
      this.logWarn(`${fileName} already exists`);
      return;
    }

    await fs.promises.writeFile(fileName, content);
  }

  private __createSettings(): Promise<void> {
    const cascSettings: CascSettingsDto = {
      crypto: {
        strategy: "rsa",
      },
      privateKey: {
        format: "pkcs8-private-pem",
        strategies: {
          file: "private.pem",
          env: "CASC_PRIVATE_KEY",
        },
      },
      publicKey: {
        format: "pkcs8-public-pem",
        strategies: {
          file: "public.pem",
        },
      },
    };

    return this.__createFile("settings.yaml", yaml.safeDump(cascSettings));
  }
}
