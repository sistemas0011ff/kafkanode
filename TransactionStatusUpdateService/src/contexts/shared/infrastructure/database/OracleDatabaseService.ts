import oracledb /*, { Connection }*/ from 'oracledb';
import { IDatabaseService } from './IDatabaseService';

export class OracleDatabaseService implements IDatabaseService {
  private static instance: OracleDatabaseService;
  private connection: oracledb.Connection | null = null;
  public constructor(
    private user: string,
    private password: string,
    private connectString: string,
  ) { }

  public static getInstance(): OracleDatabaseService {
    if (!OracleDatabaseService.instance) {
      OracleDatabaseService.instance = new OracleDatabaseService(process.env.DB_USER, process.env.DB_PASSWORD, process.env.DB_CONNECTION_STRING);
    }
    return OracleDatabaseService.instance;
  }

  public async getConnection(): Promise<oracledb.Connection> {
    if (!this.connection) {
      try {
        this.connection = await oracledb.getConnection({
          user: this.user,
          password: this.password,
          connectString: this.connectString,
        });
      } catch (err) {
        console.error(err);
        throw err; // Lanzar el error después de registrar
      }
    }
    return this.connection;
  }


  public async execute<T>(sql: string, params?: any): Promise<T[]> {
    const connection = await this.getConnection();
    try {
      const result = await connection.execute<T>(sql, params);
      return result.rows || [];
    } catch (err) {
      console.error(err);
    }
    return [];
  }

  public async startTransaction(): Promise<void> {
    // if (!this.connection) {
    //   throw new Error('No connection available.');
    // }
    // await this.connection?.beginTransaction();
    throw new Error('No connection available.');
  }

  public async commitTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('No connection available.');
    }
    await this.connection.commit();
  }

  public async rollbackTransaction(): Promise<void> {
    if (!this.connection) {
      throw new Error('No connection available.');
    }
    await this.connection.rollback();
  }

  public async closeConnection(): Promise<void> {
    if (this.connection) {
      try {
        await this.connection.close();
        this.connection = null;
      } catch (err) {
        console.error(err);
      }
    }
  }
}
