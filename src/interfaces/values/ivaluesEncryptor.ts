import {ValuesDto} from "../dtos";

export interface IValuesEncryptor {
  readonly encrypt: (values: ValuesDto) => Promise<ValuesDto>;
}

export const IValuesEncryptorToken = Symbol();
