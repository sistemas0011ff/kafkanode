import { EachMessagePayload } from "kafkajs";

export interface IKafkaService {
  connectProducer(): Promise<void>;
  initTransaction(): Promise<void>;
  addToTransaction(topic: string, message: { value: string }): Promise<void>;
  endTransaction(success: boolean): Promise<void>;
  fireAndForget(message: string): Promise<void>;
  sendAsyncWithCallback(message: string): Promise<void>;
  sendSyncMultiple(message: string, times?: number): Promise<void>;
  connectConsumer(): Promise<void>;
  subscribeToTopic(topic: string): Promise<void>;
  consumeMessages(): Promise<void>;
  consumeMessagesv2(topic: string,callback: (message: EachMessagePayload) => Promise<void>): Promise<void>;
}
