import * as manipula from "manipula";

import {inject, injectAll, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IDecryptionStrategy,
  IDecryptionStrategyToken,
  IDecryptor,
  IDecryptorToken,
} from "../interfaces";

@singleton(IDecryptorToken)
export class Decryptor implements IDecryptor {
  private readonly __decryptionStrategy: IDecryptionStrategy;

  public constructor(
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @injectAll(IDecryptionStrategyToken)
    decryptionStrategies: readonly IDecryptionStrategy[],
  ) {
    this.__decryptionStrategy = manipula
      .from(decryptionStrategies)
      .single((x) => x.name == cascSettings.cryptoStrategy);
  }

  public decrypt(encryptedValue: string): Promise<string> {
    return this.__decryptionStrategy.decrypt(encryptedValue);
  }
}
