import * as httpStatus from 'http-status';
import BaseException from '../BaseException';

export class SalesApiException extends BaseException {
  constructor(message?: string, status?: number, error?: unknown) {
    super(message, 'DEVICE_API_EXCEPTION', status || httpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
