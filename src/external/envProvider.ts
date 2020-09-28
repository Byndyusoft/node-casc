import * as path from "path";

import * as dotenv from "dotenv";

import {inject, singleton} from "../di";
import {
  ICascDirProvider,
  ICascDirProviderToken,
  IEnvProvider,
  IEnvProviderToken,
} from "../interfaces";

@singleton(IEnvProviderToken)
export class EnvProvider implements IEnvProvider {
  public constructor(
    @inject(ICascDirProviderToken)
    cascDirProvider: ICascDirProvider,
  ) {
    dotenv.config({
      path: path.join(cascDirProvider.cascDir, ".env"),
    });
  }

  public get env(): Readonly<NodeJS.ProcessEnv> {
    return process.env;
  }
}
