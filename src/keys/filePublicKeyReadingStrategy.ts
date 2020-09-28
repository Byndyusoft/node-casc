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
  IPublicKeyReadingStrategy,
  IPublicKeyReadingStrategyToken,
  KeyPathsDto,
} from "../interfaces";

import {FileKeyReadingStrategy} from "./fileKeyReadingStrategy";

@singleton(IPublicKeyReadingStrategyToken)
export class FilePublicKeyReadingStrategy
  extends FileKeyReadingStrategy
  implements IPublicKeyReadingStrategy {
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
      "public",
      FilePublicKeyReadingStrategy._name,
    );
    if (_.isNil(settings)) {
      settings = [];
    }
    keyPathsDtoValidator.validateSync(settings);

    super(cascDirProvider, fsProvider, settings);
  }
}
