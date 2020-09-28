import * as _ from "lodash";

import {inject, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IEnvProvider,
  IEnvProviderToken,
  IKeyPathsDtoValidator,
  IKeyPathsDtoValidatorToken,
  IPrivateKeyReadingStrategy,
  IPrivateKeyReadingStrategyToken,
  KeyPathsDto,
} from "../interfaces";

@singleton(IPrivateKeyReadingStrategyToken)
export class EnvPrivateKeyReadingStrategy
  implements IPrivateKeyReadingStrategy {
  private static readonly __name = "env";

  private readonly __keyPaths: readonly string[];

  public constructor(
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @inject(IEnvProviderToken)
    private readonly __envProvider: IEnvProvider,
    @inject(IKeyPathsDtoValidatorToken)
    keyPathsDtoValidator: IKeyPathsDtoValidator,
  ) {
    let settings = cascSettings.getKeyReadingStrategySettingsSync<KeyPathsDto>(
      "private",
      EnvPrivateKeyReadingStrategy.__name,
    );
    if (_.isNil(settings)) {
      settings = [];
    }
    keyPathsDtoValidator.validateSync(settings);

    this.__keyPaths = [settings].flatMap((x) => x);
  }

  public get name(): string {
    return EnvPrivateKeyReadingStrategy.__name;
  }

  public tryRead(): Promise<string | null> {
    for (const keyPath of this.__keyPaths) {
      const privateKey = this.__envProvider.env[keyPath] ?? null;
      if (_.isNil(privateKey)) {
        continue;
      }

      return Promise.resolve(privateKey);
    }

    return Promise.resolve(null);
  }
}
