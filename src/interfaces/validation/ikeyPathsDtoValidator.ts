import {KeyPathsDto} from "../dtos";

import {IValidator} from "./ivalidator";

export type IKeyPathsDtoValidator = IValidator<KeyPathsDto>;

export const IKeyPathsDtoValidatorToken = Symbol();
