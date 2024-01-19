export interface IDatabaseService {
    getConnection(): Promise<any>;
    execute<T>(sql: string, params?: any): Promise<T[]>;
    startTransaction(): Promise<void>;
    commitTransaction(): Promise<void>;
    rollbackTransaction(): Promise<void>;
    closeConnection(): Promise<void>;
  }
  