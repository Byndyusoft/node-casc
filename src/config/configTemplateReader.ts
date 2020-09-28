import * as path from "path";

import {inject, singleton} from "../di";
import {
  ICascDirProvider,
  ICascDirProviderToken,
  IConfigTemplateReader,
  IConfigTemplateReaderToken,
  IFsProvider,
  IFsProviderToken,
} from "../interfaces";

@singleton(IConfigTemplateReaderToken)
export class ConfigTemplateReader implements IConfigTemplateReader {
  private readonly __configTemplateFileName: string;

  public constructor(
    @inject(ICascDirProviderToken)
    cascDirProvider: ICascDirProvider,
    @inject(IFsProviderToken) private readonly __fsProvider: IFsProvider,
  ) {
    this.__configTemplateFileName = path.join(
      cascDirProvider.cascDir,
      "config.yaml",
    );
  }

  public read(): Promise<string> {
    return this.__fsProvider.readText(this.__configTemplateFileName);
  }
}
