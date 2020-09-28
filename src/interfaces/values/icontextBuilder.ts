import {ContextDto, ValuesDto} from "../dtos";

export interface IContextBuilder {
  readonly build: (envName: string, values: ValuesDto) => Promise<ContextDto>;
}

export const IContextBuilderToken = Symbol();
