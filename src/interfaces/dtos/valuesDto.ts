import {ValueDto} from "./valueDto";

export interface ValuesDto {
  readonly [valueName: string]: ValueDto;
}
