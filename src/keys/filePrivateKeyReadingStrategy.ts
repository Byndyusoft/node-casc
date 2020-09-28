import * as _ from "lodash";

import {inject, singleton} from "../di";
import {
  ICascDirProvider,
  ICascDirProviderToken,
  ICascSettings,
  ICascSettingsToken,
  IFsProvider,
  IFsProviderToken,
  IKeyPathsDtoValidator,
  IKeyPathsDtoValidatorToken,
  IPrivateKeyReadingStrategy,
  IPrivateKeyReadingStrategyToken,
  KeyPathsDto,
} from "../interfaces";

import {FileKeyReadingStrategy} from "./fileKeyReadingStrategy";

@singleton(IPrivateKeyReadingStrategyToken)
export class FilePrivateKeyReadingStrategy
  extends FileKeyReadingStrategy
  implements IPrivateKeyReadingStrategy {
  public constructor(
    @inject(ICascDirProviderToken)
    cascDirProvider: ICascDirProvider,
    @inject(ICascSettingsToken)
    cascSettings: ICascSettings,
    @inject(IFsProviderToken)
    fsProvider: IFsProvider,
    @inject(IKeyPathsDtoValidatorToken)
    keyPathsDtoValidator: IKeyPathsDtoValidator,
  ) {
    let settings = cascSettings.getKeyReadingStrategySettingsSync<KeyPathsDto>(
      "private",
      FilePrivateKeyReadingStrategy._name,
    );
    if (_.isNil(settings)) {
      settings = [];
    }
    keyPathsDtoValidator.validateSync(settings);

    super(cascDirProvider, fsProvider, settings);
  }
}
