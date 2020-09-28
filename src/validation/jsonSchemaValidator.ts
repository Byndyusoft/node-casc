import * as Ajv from "ajv";

import {IValidator} from "../interfaces";

export abstract class JsonSchemaValidator<T> implements IValidator<T> {
  private readonly __ajv: Ajv.Ajv;

  protected constructor(schema: Record<string, unknown>) {
    this.__ajv = new Ajv();
    this.__ajv.addSchema(schema, "schema");
  }

  public validateSync(data: T): void {
    const isValid = this.__ajv.validate("schema", data) as boolean;
    if (!isValid) {
      throw new Error(this.__ajv.errorsText());
    }
  }
}
