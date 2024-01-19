import { Request, Response, NextFunction } from 'express';
import { CustomException } from '../../contexts/shared/infrastructure/exceptions/CustomException';

const ErrorHandlerMiddleware = (err: CustomException, req: Request, res: Response, next: NextFunction): void => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    status: 'error',
    statusCode: statusCode,
    message: err.message
  });
};

export default ErrorHandlerMiddleware;
