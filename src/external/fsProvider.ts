import * as fs from "fs";

import * as yaml from "js-yaml";

import {singleton} from "../di";
import {IFsProvider, IFsProviderToken} from "../interfaces";

@singleton(IFsProviderToken)
export class FsProvider implements IFsProvider {
  public async hasReadAccess(fileName: string): Promise<boolean> {
    try {
      await fs.promises.access(fileName, fs.constants.R_OK);
      return true;
    } catch {
      return false;
    }
  }

  public readText(fileName: string): Promise<string> {
    return fs.promises.readFile(fileName, "utf8");
  }

  public readTextSync(fileName: string): string {
    return fs.readFileSync(fileName, "utf8");
  }

  public async readYaml<T>(fileName: string): Promise<T> {
    return (yaml.load(await this.readText(fileName)) as unknown) as T;
  }

  public readYamlSync<T>(fileName: string): T {
    return (yaml.load(this.readTextSync(fileName)) as unknown) as T;
  }
}
