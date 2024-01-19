import * as httpStatus from 'http-status';
import BaseException from '../BaseException';

export class ShoppingCartApiException extends BaseException {
  constructor(message?: string, status?: number, error?: unknown) {
    super(message, 'SHOPPING_CART_API_EXCEPTION', status || httpStatus.INTERNAL_SERVER_ERROR, error);
  }
}
