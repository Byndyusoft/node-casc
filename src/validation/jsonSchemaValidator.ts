import Ajv from "ajv/dist/2019";

import {IValidator} from "../interfaces";

export abstract class JsonSchemaValidator<T> implements IValidator<T> {
  private readonly __ajv: Ajv;

  protected constructor(schema: Record<string, unknown>) {
    this.__ajv = new Ajv({
      allowUnionTypes: true,
    });
    this.__ajv.addSchema(schema, "schema");
  }

  public validateSync(data: T): void {
    const isValid = this.__ajv.validate("schema", data);
    if (!isValid) {
      throw new Error(this.__ajv.errorsText());
    }
  }
}
