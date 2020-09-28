import {inject, injectAll, singleton} from "../di";
import {
  ICascSettings,
  ICascSettingsToken,
  IPrivateKeyReader,
  IPrivateKeyReaderToken,
  IPrivateKeyReadingStrategy,
  IPrivateKeyReadingStrategyToken,
} from "../interfaces";

import {KeyReader} from "./keyReader";

@singleton(IPrivateKeyReaderToken)
export class PrivateKeyReader extends KeyReader implements IPrivateKeyReader {
  public constructor(
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @injectAll(IPrivateKeyReadingStrategyToken)
    privateKeyReadingStrategies: readonly IPrivateKeyReadingStrategy[],
  ) {
    super(
      "private",
      cascSettings.privateKeyReadingStrategies,
      privateKeyReadingStrategies,
    );
  }
}
