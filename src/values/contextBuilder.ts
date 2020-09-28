import * as _ from "lodash";
import * as manipula from "manipula";
import {Writable} from "ts-essentials";

import {inject, singleton} from "../di";
import {
  ContextDto,
  IContextBuilder,
  IContextBuilderToken,
  IDecryptor,
  IDecryptorToken,
  TElementaryValue,
  ValueDto,
  ValuesDto,
} from "../interfaces";

import {ValuesTransformer} from "./valuesTransformer";

@singleton(IContextBuilderToken)
export class ContextBuilder
  extends ValuesTransformer
  implements IContextBuilder {
  public constructor(
    @inject(IDecryptorToken) private readonly __decryptor: IDecryptor,
  ) {
    super();
  }

  public async build(envName: string, values: ValuesDto): Promise<ContextDto> {
    const orderedEnvNames = [envName, "default"].flatMap((orderedEnvName) =>
      ["", "!", "*"].map((modifier) => `${orderedEnvName}${modifier}`),
    );

    const decryptedValues = await this._transform(
      values,
      (valueName, envNames) => {
        const selectedEnvName = manipula
          .from(orderedEnvNames)
          .firstOrDefault((orderedEnvName) =>
            envNames.includes(orderedEnvName),
          );
        if (_.isNil(selectedEnvName)) {
          throw new Error(`can't find env for ${valueName}`);
        }

        return [selectedEnvName];
      },
    );

    return _.transform<ValueDto, Writable<ContextDto>>(
      decryptedValues,
      (context, value, valueName) => {
        context[valueName] = value.default;
      },
    );
  }

  protected _transformElementaryValue(
    envName: string,
    elementaryValue: FlatArray<TElementaryValue, 1>,
  ): Promise<FlatArray<TElementaryValue, 1>> {
    return envName.endsWith("*") && typeof elementaryValue === "string"
      ? this.__decryptor.decrypt(elementaryValue)
      : Promise.resolve(elementaryValue);
  }

  protected _transformEnvNameSync(): string {
    return "default";
  }
}
