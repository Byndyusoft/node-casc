import * as path from "path";

import * as _ from "lodash";
import {DeepWritable} from "ts-essentials";

import {inject, singleton} from "../di";
import {
  ICascDirProvider,
  ICascDirProviderToken,
  IEnvProvider,
  IEnvProviderToken,
  IFsProvider,
  IFsProviderToken,
  IValuesDtoValidator,
  IValuesDtoValidatorToken,
  IValuesReader,
  IValuesReaderToken,
  ValuesDto,
} from "../interfaces";

@singleton(IValuesReaderToken)
export class ValuesReader implements IValuesReader {
  private get __valuesFileName(): string {
    return path.join(this.__cascDirProvider.cascDir, "values.yaml");
  }

  private get __valuesOverrideFileName(): string {
    return path.join(this.__cascDirProvider.cascDir, "values.override.yaml");
  }

  public constructor(
    @inject(ICascDirProviderToken)
    private readonly __cascDirProvider: ICascDirProvider,
    @inject(IEnvProviderToken)
    private readonly __envProvider: IEnvProvider,
    @inject(IFsProviderToken)
    private readonly __fsProvider: IFsProvider,
    @inject(IValuesDtoValidatorToken)
    private readonly __valuesDtoValidator: IValuesDtoValidator,
  ) {}

  public async read(override: boolean): Promise<ValuesDto> {
    const values = await this.__readFromFile(this.__valuesFileName);

    if (!override) {
      return values;
    }

    return {
      ...values,
      ...(await this.__readFromFile(this.__valuesOverrideFileName)),
      ...this.__readFromEnv(),
    };
  }

  private __readFromEnv(): ValuesDto {
    const values = _.transform<string | undefined, DeepWritable<ValuesDto>>(
      this.__envProvider.env,
      (result, value, key) => {
        if (!_.isNil(value) && /^[A-Za-z_]\w*$/.test(key)) {
          result[key] = {
            default: value,
          };
        }
      },
    );
    this.__valuesDtoValidator.validateSync(values);

    return values;
  }

  private async __readFromFile(fileName: string): Promise<ValuesDto> {
    if (!(await this.__fsProvider.hasReadAccess(fileName))) {
      return {};
    }

    const values = await this.__fsProvider.readYaml<ValuesDto>(fileName);
    if (_.isNil(values)) {
      return {};
    }
    this.__valuesDtoValidator.validateSync(values);

    return values;
  }
}
