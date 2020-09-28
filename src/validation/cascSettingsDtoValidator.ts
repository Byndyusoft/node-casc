import {singleton} from "../di";
import {
  CascSettingsDto,
  ICascSettingsDtoValidator,
  ICascSettingsDtoValidatorToken,
} from "../interfaces";

import {JsonSchemaValidator} from "./jsonSchemaValidator";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema",
  type: "object",
  additionalProperties: false,
  required: ["crypto", "privateKey", "publicKey"],
  properties: {
    crypto: {
      type: "object",
      additionalProperties: false,
      required: ["strategy"],
      properties: {
        strategy: {
          type: "string",
          pattern: "^[A-Za-z_]\\w*$",
        },
      },
    },
    privateKey: {
      type: "object",
      additionalProperties: false,
      required: ["format", "strategies"],
      properties: {
        format: {
          type: "string",
        },
        strategies: {
          type: "object",
          additionalProperties: false,
          patternProperties: {
            "^[A-Za-z_]\\w*$": {},
          },
        },
      },
    },
    publicKey: {
      type: "object",
      additionalProperties: false,
      required: ["format", "strategies"],
      properties: {
        format: {
          type: "string",
        },
        strategies: {
          type: "object",
          additionalProperties: false,
          patternProperties: {
            "^[A-Za-z_]\\w*$": {},
          },
        },
      },
    },
  },
};

@singleton(ICascSettingsDtoValidatorToken)
export class CascSettingsDtoValidator
  extends JsonSchemaValidator<CascSettingsDto>
  implements ICascSettingsDtoValidator {
  public constructor() {
    super(schema);
  }
}
