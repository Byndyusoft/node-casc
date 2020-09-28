import {Writable} from "ts-essentials";

import {TElementaryValue, ValueDto, ValuesDto} from "../interfaces";

export abstract class ValuesTransformer {
  protected async _transform(
    values: ValuesDto,
    envNamesFilterSync: (
      valueName: string,
      envNames: readonly string[],
    ) => readonly string[] = (_, envNames) => envNames,
  ): Promise<ValuesDto> {
    const valuesResult: Writable<ValuesDto> = {};

    for (const [valueName, value] of Object.entries(values)) {
      const valueResult: Writable<ValueDto> = {};

      for (const envName of envNamesFilterSync(valueName, Object.keys(value))) {
        const isElementaryValueArray = Array.isArray(value[envName]);
        const elementaryValue = await Promise.all(
          [value[envName]]
            .flatMap((x) => x)
            .map((x) => this._transformElementaryValue(envName, x)),
        );

        valueResult[
          this._transformEnvNameSync(envName)
        ] = isElementaryValueArray ? elementaryValue : elementaryValue[0];
      }

      valuesResult[valueName] = valueResult;
    }

    return valuesResult;
  }

  protected abstract _transformElementaryValue(
    _envName: string,
    elementaryValue: FlatArray<TElementaryValue, 1>,
  ): Promise<FlatArray<TElementaryValue, 1>>;

  protected abstract _transformEnvNameSync(envName: string): string;
}
