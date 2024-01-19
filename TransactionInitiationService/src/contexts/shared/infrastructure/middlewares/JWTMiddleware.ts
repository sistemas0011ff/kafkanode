import { NextFunction, Request, Response } from 'express';

import httpStatus from 'http-status';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { config }  from '../../../../app/config';

interface CustomHeaderRequest extends Request {
  headers: {
    'app-token': string;
  };
}

export interface CustomRequest extends CustomHeaderRequest {
  token: string | JwtPayload;
}

export class JWTMiddleware {
  constructor(private isPinProtected: Boolean = false) {}

  run = (req: CustomHeaderRequest, res: Response, next: NextFunction): void => {
    try {
      const secretVerificationKey = this.isPinProtected
        ? config.get('jwt.protectedSecretKey')
        : config.get('jwt.secretKey');
      const bearerToken = req.headers['app-token'].split(' ')[1];
      const verified = jwt.verify(bearerToken, secretVerificationKey);
      if (!verified) {
        res.status(httpStatus.UNAUTHORIZED).send();
      }
      (req as CustomRequest).token = verified;
      next();
    } catch (error) {
      log.info(error);
      res.status(httpStatus.UNAUTHORIZED).send();
    }
  };
}
