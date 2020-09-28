import {CascSettingsDto} from "../dtos";

import {IValidator} from "./ivalidator";

export type ICascSettingsDtoValidator = IValidator<CascSettingsDto>;

export const ICascSettingsDtoValidatorToken = Symbol();
