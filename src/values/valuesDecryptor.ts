import {inject, singleton} from "../di";
import {
  IDecryptor,
  IDecryptorToken,
  IValuesDecryptor,
  IValuesDecryptorToken,
  TElementaryValue,
  ValuesDto,
} from "../interfaces";

import {ValuesTransformer} from "./valuesTransformer";

@singleton(IValuesDecryptorToken)
export class ValuesDecryptor
  extends ValuesTransformer
  implements IValuesDecryptor {
  public constructor(
    @inject(IDecryptorToken) private readonly __decryptor: IDecryptor,
  ) {
    super();
  }

  public decrypt(values: ValuesDto): Promise<ValuesDto> {
    return this._transform(values);
  }

  protected _transformElementaryValue(
    envName: string,
    elementaryValue: FlatArray<TElementaryValue, 1>,
  ): Promise<FlatArray<TElementaryValue, 1>> {
    return envName.endsWith("*") && typeof elementaryValue === "string"
      ? this.__decryptor.decrypt(elementaryValue)
      : Promise.resolve(elementaryValue);
  }

  protected _transformEnvNameSync(envName: string): string {
    return envName.endsWith("*") ? `${envName.slice(0, -1)}!` : envName;
  }
}
