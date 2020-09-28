import {TElementaryValue} from "../types";

export interface ValueDto {
  readonly [envName: string]: TElementaryValue;
}
