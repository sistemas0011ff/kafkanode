import { Consumer, EachMessagePayload, Kafka, Producer, ProducerRecord, Transaction } from 'kafkajs';
import { Service, Token } from 'typedi';
import { IKafkaService } from '../interfaces/IKafkaService';
import { Uuid } from '../../domain/valueobject/Uuid';

export const KafkaServiceToken = new Token<KafkaService>();

@Service(KafkaServiceToken)
export class KafkaService implements IKafkaService {
  private producer: Producer;
  private consumer: Consumer;
  private isConnected: boolean = false;
  private transaction?: Transaction;
  private useTransactions: boolean;
  private isIdempotent: boolean;
  private topic: string;
  
  constructor(private kafka: Kafka, useTransactions = false, isIdempotent = false) {
    this.useTransactions = useTransactions;
    this.isIdempotent = isIdempotent;
    this.consumer = this.kafka.consumer({ groupId: `your-group-id-${Uuid.random().toString()}` });
    this.producer = this.kafka.producer({
      transactionalId: useTransactions ? `unique-transactional-id-${Uuid.random().toString()}` : undefined,
      idempotent: isIdempotent,
    });
    
  }
   
  async subscribeToTopic(topic: string) {
    await this.consumer.subscribe({ topic: topic, fromBeginning: true });
    console.log(`Subscribed to topic ${topic}`);
  }

  async consumeMessagesv2(topic: string, callback: (message: EachMessagePayload) => Promise<void>) {
    await this.consumer.subscribe({ topic, fromBeginning: true });
    console.log("Iniciando consumo de mensajes con consumeMessages...");

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try { 
          const messageValue = payload.message.value ? payload.message.value.toString() : null;
          console.log("Mensaje recibido:", {
            topic: payload.topic,
            partition: payload.partition,
            offset: payload.message.offset,
            value: messageValue,
          });

          // Si hay un valor en el mensaje, llama al callback
          if (messageValue) {
            await callback(payload);
            console.log("Mensaje procesado con éxito");
          }
        } catch (error) {
          console.error("Error al procesar mensaje:", error);
        }
      },
    });
  }
 
  async consumeMessages() {
    await this.consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        console.log({
          value: message.value.toString(),
          topic,
          partition,
        }); 
      },
    });
  }
 

  async connectConsumer() {
    await this.consumer.connect();
    console.log('Consumer connected to Kafka');
  }
 
  async connectProducer() {
    if (!this.isConnected) {
      console.log('Connecting to Kafka Producer...');
      await this.producer.connect();
      this.isConnected = true;
      console.log('Producer connected to Kafka successfully.');
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
      console.warn("No hay ninguna transacción iniciada.");
      return;
    }

    try { 
      await this.transaction.send({
        topic,
        messages: [message],
      });
      console.log(`Mensaje añadido a la transacción para el tópico ${topic}`);
    } catch (error) {
      console.error("Error al añadir mensaje a la transacción:", error); 
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

  // Envío de Fuego y Olvido
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
   
  // Envío Asincrónico con Callback
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
