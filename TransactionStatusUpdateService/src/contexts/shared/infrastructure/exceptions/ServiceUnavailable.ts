import BaseException from './BaseException';

export class ServiceUnavailable extends BaseException {
  constructor(message: string, status: number, error: unknown) {
    super(message, 'SERVICE_UNAVAILABLE', status, error);
  }
}
