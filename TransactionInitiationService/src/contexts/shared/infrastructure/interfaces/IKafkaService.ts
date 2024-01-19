export interface IKafkaService {
    connect(): Promise<void>;
    initTransaction(): Promise<void>;
    addToTransaction(topic: string, message: { value: string }): Promise<void>;
    endTransaction(success: boolean): Promise<void>;
    fireAndForget(message: string): Promise<void>;
    sendAsync(message: string, acks?: number): Promise<void>;
    sendAsyncWithCallback(message: string): Promise<void>;
    sendSyncMultiple(message: string, times?: number): Promise<void>;
  }
  