import {singleton} from "../di";
import {
  IKeyPathsDtoValidator,
  IKeyPathsDtoValidatorToken,
  KeyPathsDto,
} from "../interfaces";

import {JsonSchemaValidator} from "./jsonSchemaValidator";

const schema = {
  $schema: "https://json-schema.org/draft/2019-09/schema",
  type: ["string", "array"],
  items: {
    type: "string",
  },
};

@singleton(IKeyPathsDtoValidatorToken)
export class KeyPathsDtoValidator
  extends JsonSchemaValidator<KeyPathsDto>
  implements IKeyPathsDtoValidator {
  public constructor() {
    super(schema);
  }
}
