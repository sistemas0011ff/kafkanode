import { CustomException } from './CustomException';

export class CustomNotFoundException extends CustomException {
  constructor(message?: string) {
    super(message || 'Not Found', 404);
  }
}