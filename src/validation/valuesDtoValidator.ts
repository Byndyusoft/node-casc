import {singleton} from "../di";
import {
  IValuesDtoValidator,
  IValuesDtoValidatorToken,
  ValuesDto,
} from "../interfaces";

import {JsonSchemaValidator} from "./jsonSchemaValidator";

const schema = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  type: "object",
  additionalProperties: false,
  patternProperties: {
    "^[A-Za-z_]\\w*$": {
      type: "object",
      additionalProperties: false,
      patternProperties: {
        "^[A-Za-z_]\\w*[*!]?$": {
          type: ["string", "number", "boolean", "null", "array"],
          items: {
            type: ["string", "number", "boolean", "null"],
          },
        },
      },
    },
  },
};

@singleton(IValuesDtoValidatorToken)
export class ValuesDtoValidator
  extends JsonSchemaValidator<ValuesDto>
  implements IValuesDtoValidator {
  public constructor() {
    super(schema);
  }
}
