import * as path from "path";

import {singleton} from "../di";
import {ICascDirProvider, ICascDirProviderToken} from "../interfaces";

@singleton(ICascDirProviderToken)
export class CascDirProvider implements ICascDirProvider {
  private __cascDir: string;

  public constructor() {
    this.__cascDir = path.join(process.cwd(), ".casc");
  }

  public get cascDir(): string {
    return this.__cascDir;
  }

  public set cascDir(value: string) {
    this.__cascDir = value;
  }
}
