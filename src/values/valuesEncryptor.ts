import {inject, singleton} from "../di";
import {
  IEncryptor,
  IEncryptorToken,
  IValuesEncryptor,
  IValuesEncryptorToken,
  TElementaryValue,
  ValuesDto,
} from "../interfaces";

import {ValuesTransformer} from "./valuesTransformer";

@singleton(IValuesEncryptorToken)
export class ValuesEncryptor
  extends ValuesTransformer
  implements IValuesEncryptor {
  public constructor(
    @inject(IEncryptorToken) private readonly __encryptor: IEncryptor,
  ) {
    super();
  }

  public encrypt(values: ValuesDto): Promise<ValuesDto> {
    return this._transform(values);
  }

  protected _transformElementaryValue(
    envName: string,
    elementaryValue: FlatArray<TElementaryValue, 1>,
  ): Promise<FlatArray<TElementaryValue, 1>> {
    return envName.endsWith("!") && typeof elementaryValue === "string"
      ? this.__encryptor.encrypt(elementaryValue)
      : Promise.resolve(elementaryValue);
  }

  protected _transformEnvNameSync(envName: string): string {
    return envName.endsWith("!") ? `${envName.slice(0, -1)}*` : envName;
  }
}
