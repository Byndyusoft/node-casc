import * as manipula from "manipula";

import {inject, injectAll, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IEncryptionStrategy,
  IEncryptionStrategyToken,
  IEncryptor,
  IEncryptorToken,
} from "../interfaces";

@singleton(IEncryptorToken)
export class Encryptor implements IEncryptor {
  private readonly __encryptionStrategy: IEncryptionStrategy;

  public constructor(
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @injectAll(IEncryptionStrategyToken)
    encryptionStrategies: readonly IEncryptionStrategy[],
  ) {
    this.__encryptionStrategy = manipula
      .from(encryptionStrategies)
      .single((x) => x.name == cascSettings.cryptoStrategy);
  }

  public encrypt(value: string): Promise<string> {
    return this.__encryptionStrategy.encrypt(value);
  }
}
