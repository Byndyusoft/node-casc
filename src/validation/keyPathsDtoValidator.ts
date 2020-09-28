import {singleton} from "../di";
import {
  IKeyPathsDtoValidator,
  IKeyPathsDtoValidatorToken,
  KeyPathsDto,
} from "../interfaces";

import {JsonSchemaValidator} from "./jsonSchemaValidator";

const schema = {
  $schema: "http://json-schema.org/draft-07/schema",
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
