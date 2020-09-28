import * as path from "path";

import {inject, singleton} from "../di";
import {
  CascSettingsDto,
  ICascDirProvider,
  ICascDirProviderToken,
  ICascSettings,
  ICascSettingsDtoValidator,
  ICascSettingsDtoValidatorToken,
  ICascSettingsToken,
  IFsProvider,
  IFsProviderToken,
  TKeyType,
} from "../interfaces";

@singleton(ICascSettingsToken)
export class CascSettings implements ICascSettings {
  private readonly __cascSettings: CascSettingsDto;

  private readonly __privateKeyReadingStrategies: readonly string[];

  private readonly __publicKeyReadingStrategies: readonly string[];

  public constructor(
    @inject(ICascDirProviderToken)
    cascDirProvider: ICascDirProvider,
    @inject(ICascSettingsDtoValidatorToken)
    cascSettingsDtoValidator: ICascSettingsDtoValidator,
    @inject(IFsProviderToken)
    fsProvider: IFsProvider,
  ) {
    const cascSettingsFileName = path.join(
      cascDirProvider.cascDir,
      "settings.yaml",
    );
    this.__cascSettings = fsProvider.readYamlSync(cascSettingsFileName);
    cascSettingsDtoValidator.validateSync(this.__cascSettings);

    this.__privateKeyReadingStrategies = Object.keys(
      this.__cascSettings.privateKey.strategies,
    );
    this.__publicKeyReadingStrategies = Object.keys(
      this.__cascSettings.publicKey.strategies,
    );
  }

  public get cryptoStrategy(): string {
    return this.__cascSettings.crypto.strategy;
  }

  public get privateKeyFormat(): string {
    return this.__cascSettings.privateKey.format;
  }

  public get privateKeyReadingStrategies(): readonly string[] {
    return this.__privateKeyReadingStrategies;
  }

  public get publicKeyFormat(): string {
    return this.__cascSettings.publicKey.format;
  }

  public get publicKeyReadingStrategies(): readonly string[] {
    return this.__publicKeyReadingStrategies;
  }

  public getKeyReadingStrategySettingsSync<T>(
    keyType: TKeyType,
    strategyName: string,
  ): T | null {
    let keyPath: "privateKey" | "publicKey";
    switch (keyType) {
      case "private":
        keyPath = "privateKey";
        break;
      case "public":
        keyPath = "publicKey";
        break;
    }

    return (
      (this.__cascSettings[keyPath].strategies[strategyName] as
        | T
        | undefined) ?? null
    );
  }
}
