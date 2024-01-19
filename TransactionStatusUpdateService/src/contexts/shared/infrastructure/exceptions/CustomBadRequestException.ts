// CustomBadRequestException.ts
import { CustomException } from './CustomException';

export class CustomBadRequestException extends CustomException {
  constructor(message?: string) {
    super(message || 'Bad Request', 400);
  }
}