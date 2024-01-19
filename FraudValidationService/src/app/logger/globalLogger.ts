import { BaseLogger } from "./BaseLogger";

declare global {
    var log: BaseLogger;
    namespace NodeJS {
      interface Global {
        log: BaseLogger;
      }
    }
  }