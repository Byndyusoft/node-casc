import * as path from "path";

import {
  ICascDirProvider,
  IFsProvider,
  IKeyReadingStrategy,
  KeyPathsDto,
} from "../interfaces";

export abstract class FileKeyReadingStrategy implements IKeyReadingStrategy {
  protected static readonly _name = "file";

  private readonly __keyPaths: readonly string[];

  protected constructor(
    cascDirProvider: ICascDirProvider,
    private readonly __fsProvider: IFsProvider,
    settings: KeyPathsDto,
  ) {
    this.__keyPaths = [settings]
      .flatMap((x) => x)
      .map((keyPath) =>
        path.isAbsolute(keyPath)
          ? keyPath
          : path.join(cascDirProvider.cascDir, "keys", keyPath),
      );
  }

  public get name(): string {
    return FileKeyReadingStrategy._name;
  }

  public async tryRead(): Promise<string | null> {
    for (const keyPath of this.__keyPaths) {
      if (!(await this.__fsProvider.hasReadAccess(keyPath))) {
        continue;
      }

      return this.__fsProvider.readText(keyPath);
    }

    return null;
  }
}
