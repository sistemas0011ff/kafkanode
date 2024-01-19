import httpStatus from 'http-status';

export default class BaseApiResponse<T> {
  message: T;
  success: boolean;
  error: any;

  public make(message: T, error?: any, success?: boolean): BaseApiResponse<T> {
    this.message = message;
    this.error = error
      ? {
          type: error.type || 'NOT HANDLED ERROR',
          info: error.message || error.info || error
        }
      : null;
    this.success = success || false;
    if (error) {
      if (error.type) {
        log.error({
          action: 'response',
          // status: error.status,
          content: error.message
        });
      } else {
        log.fatal({
          action: 'response',
          // status: httpStatus.INTERNAL_SERVER_ERROR,
          content: error.message,
          stack: error.stack
        });
      }
    } else {
      log.info({
        action: 'response',
        status: httpStatus.OK,
        content: message
      });
    }
    return this;
  }
}
