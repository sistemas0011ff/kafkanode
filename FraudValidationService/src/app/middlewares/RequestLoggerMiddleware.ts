import { Request, Response, NextFunction } from 'express';

export class RequestLoggerMiddleware {
  run = (req: Request, res: Response, next: NextFunction): void => {
    log.info({
      action: 'request',
      url: `${req.protocol}://${req.headers.host}${req.originalUrl}`,
      method: req.method,
      content: { ...req.query, ...req.params, ...req.body },
      ip: req.ip,
    });
    next();
  };
}
