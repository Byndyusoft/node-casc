import {ValuesDto} from "../dtos";

import {IValidator} from "./ivalidator";

export type IValuesDtoValidator = IValidator<ValuesDto>;

export const IValuesDtoValidatorToken = Symbol();
