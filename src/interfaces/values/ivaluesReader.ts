import {ValuesDto} from "../dtos";

export interface IValuesReader {
  readonly read: (override: boolean) => Promise<ValuesDto>;
}

export const IValuesReaderToken = Symbol();
