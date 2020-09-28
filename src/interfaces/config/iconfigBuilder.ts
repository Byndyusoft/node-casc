import {ContextDto} from "../dtos";

export interface IConfigBuilder {
  readonly build: <TConfig = unknown>(context: ContextDto) => Promise<TConfig>;
}

export const IConfigBuilderToken = Symbol();
