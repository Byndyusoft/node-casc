import {inject, injectAll, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IPublicKeyReader,
  IPublicKeyReaderToken,
  IPublicKeyReadingStrategy,
  IPublicKeyReadingStrategyToken,
} from "../interfaces";

import {KeyReader} from "./keyReader";

@singleton(IPublicKeyReaderToken)
export class PublicKeyReader extends KeyReader implements IPublicKeyReader {
  public constructor(
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @injectAll(IPublicKeyReadingStrategyToken)
    publicKeyReadingStrategies: readonly IPublicKeyReadingStrategy[],
  ) {
    super(
      "public",
      cascSettings.publicKeyReadingStrategies,
      publicKeyReadingStrategies,
    );
  }
}
