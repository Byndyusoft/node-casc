import {TElementaryValue} from "../types";

export interface ContextDto {
  readonly [valueName: string]: TElementaryValue;
}
