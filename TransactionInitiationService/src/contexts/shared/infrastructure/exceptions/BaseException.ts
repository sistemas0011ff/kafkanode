import { IBaseException } from '../interfaces/IBaseException';

export default class BaseException extends Error implements IBaseException {
  public status: number;
  public type: string;
  public info: any;

  constructor(
    message: string,
    type: string,
    status: number,
    error: unknown = null
  ) {
    super(message);
    this.type = type;
    this.status = status;
    this.info = error;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, BaseException);
    }
    Object.setPrototypeOf(this, BaseException.prototype);
  }

  public set setInfo(info: unknown) {
    this.info = info;
  }
}
