import Ajv, { AnySchema, ErrorObject } from 'ajv';
import addFormats from 'ajv-formats';

export default class Validate {
  protected ajv: Ajv;
  result: any;
  errorMessage: Array<ErrorObject> | null | undefined = [];
  constructor() {
    this.ajv = new Ajv({ allErrors: true });
    addFormats(this.ajv);
  }

  run(schema: AnySchema, data: unknown): any {
    const validate = this.ajv.compile(schema);
    if (validate(data)) {
      this.result = true;
      return this.result;
    }
    this.errorMessage = validate.errors;
    this.result = false;
    return this.result;
  }
}
