import { Request, Response, NextFunction } from 'express';
import status from 'http-status';
import Validate from '../../../../app/ajv/Validate';

export class ValidateMiddleware {
  schema: unknown;
  validate: Validate;

  constructor(schema: unknown, validate: Validate) {
    this.schema = schema;
    this.validate = validate;
  }

  run = (req: Request, res: Response, next: NextFunction): void => {
    const { body } = req;
    this.validate.run(this.schema, body);

    if (!this.validate.result) {
      res.status(status.BAD_REQUEST).send({
        success: false,
        errors: this.validate.errorMessage
      });
    } else {
      next();
    }
  };
}
