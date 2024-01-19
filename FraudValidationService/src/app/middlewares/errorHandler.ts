import { Request, Response, NextFunction } from 'express';
import { CustomException } from '../../contexts/shared/infrastructure/exceptions/CustomException';
export const errorHandler = (
  error: CustomException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error',
  });
};


