import { Kafka, Producer, Transaction } from 'kafkajs';
import { Service, Token } from 'typedi';
import { IKafkaService } from '../interfaces/IKafkaService';

export const KafkaServiceToken = new Token<KafkaService>();

@Service(KafkaServiceToken)
export class KafkaService implements IKafkaService {
  private producer: Producer;
  private isConnected: boolean = false;
  private transaction?: Transaction;
  private useTransactions: boolean;
  private isIdempotent: boolean;

  constructor(private kafka: Kafka, private topic: string, useTransactions = false, isIdempotent = false) {
    console.log(`Creating KafkaService with topic: ${topic}, transactions: ${useTransactions}, idempotence: ${isIdempotent}`);

    this.useTransactions = useTransactions;
    this.isIdempotent = isIdempotent;
    this.producer = this.kafka.producer({
      transactionalId: useTransactions ? 'unique-transactional-id' : undefined,
      idempotent: isIdempotent,
    });
    console.log(`Kafka producer configured with transactionalId: ${useTransactions ? 'unique-transactional-id' : 'none'}, idempotent: ${isIdempotent}`);
  }

  async connect() {
    if (!this.isConnected) {
      console.log('Connecting to Kafka...');

      await this.producer.connect();
      this.isConnected = true;
      console.log('Connected to Kafka successfully.');

    }
  }

  async initTransaction() {
    if (!this.isConnected) {
      return;
    }
    this.transaction = await this.producer.transaction();
  }

  async addToTransaction(topic: string, message: { value: string }) {
    if (!this.transaction) {
      return;
    }
    try {
      await this.transaction.send({
        topic,
        messages: [message],
      });
    } catch (error) {
    }
  }

  async endTransaction(success: boolean) {
    if (!this.transaction) {
      return;
    }
    try {
      if (success) {
        await this.transaction.commit();
      } else {
        await this.transaction.abort();
      }
    } catch (error) {
    } finally {
      this.transaction = undefined;
    }
  }
  async fireAndForget(message: string) {
    if (!this.isConnected) {
      return;
    }
    try {
      await this.producer.send({
        topic: this.topic,
        messages: [{ value: message }],
        acks: 0
      });
    } catch (error) {
    }
  }
  async sendAsync(message: string) {
    if (!this.isConnected) {
      console.log("Producer not connected. Cannot send message.");
      return;
    }
    console.log(`Sending message to topic "${this.topic}": ${message}`);

    try {
      const sendResult = await this.producer.send({
        topic: this.topic,
        messages: [{ value: message }],
        acks: this.isIdempotent ? -1 : 1
      });
      console.log(`Message sent successfully: ${message}`);
      sendResult.forEach(result => {
        console.log(`Confirmation received: Topic ${result.topicName}, Partition ${result.partition}, Offset ${result.baseOffset}`);
      });
    } catch (error) {
      console.error('Error in async send:', error);
    }
  }

  async sendAsyncWithCallback(message: string) {
    if (!this.isConnected) {
      return;
    }

    this.producer.send({
      topic: this.topic,
      messages: [{ value: message }],
      acks: -1
    }).then(result => {
      result.forEach(res => {
      });
    }).catch(error => {
    });
  }


  async sendSyncMultiple(message: string, times = 5) {
    if (!this.isConnected) {
      return;
    }
    for (let i = 1; i <= times; i++) {
      try {
        const sendResult = await this.producer.send({
          topic: this.topic,
          messages: [{ value: `${message} | Envío número ${i}` }],
          acks: 1
        });

        sendResult.forEach(result => {

        });
      } catch (error) {

      }
    }
  }
}
