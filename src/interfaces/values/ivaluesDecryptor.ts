import {ValuesDto} from "../dtos";

export interface IValuesDecryptor {
  readonly decrypt: (values: ValuesDto) => Promise<ValuesDto>;
}

export const IValuesDecryptorToken = Symbol();
