import { BaseLogger } from './BaseLogger';
import './globalLogger'; 

export class Logger {
  private readonly log: BaseLogger;

  constructor(log: BaseLogger) {
    this.log = log;
  }

  initializer = (): void => {
    (global as any).log = this.log;
  };
}
