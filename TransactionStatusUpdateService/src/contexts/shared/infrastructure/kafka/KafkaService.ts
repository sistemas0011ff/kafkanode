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
    console.log("Iniciando consumo de mensajes con consumeMessagesv2...");

    await this.consumer.run({
      eachMessage: async (payload: EachMessagePayload) => {
        try {
          // Verifica si hay un mensaje y lo convierte a string
          const messageValue = payload.message.value ? payload.message.value.toString() : null;
          console.log("Mensaje recibido en consumeMessagesv2:", {
            topic: payload.topic,
            partition: payload.partition,
            offset: payload.message.offset,
            value: messageValue,
          });

          // Si hay un valor en el mensaje, llama al callback
          if (messageValue) {
            await callback(payload);
            console.log("Mensaje procesado con éxito en consumeMessagesv2");
          }
        } catch (error) {
          console.error("Error al procesar mensaje en consumeMessagesv2:", error);
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
        // Aquí manejas el mensaje recibido
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


  // Inicia una transacción
  async initTransaction() {
    if (!this.isConnected) {
      return;
    }
    this.transaction = await this.producer.transaction();
  }
 
  async addToTransaction(topic: string, message: { value: string }) {
    // Verifica si hay una transacción iniciada
    if (!this.transaction) {
      console.warn("No hay ninguna transacción iniciada.");
      return;
    }

    try {
      // Añade el mensaje a la transacción actual
      await this.transaction.send({
        topic,
        messages: [message],
      });
      console.log(`Mensaje añadido a la transacción para el tópico ${topic}`);
    } catch (error) {
      console.error("Error al añadir mensaje a la transacción:", error);
      // Aquí podrías manejar el error, como reintentar o abortar la transacción
    }
  }
  // Finaliza la transacción con commit o abort dependiendo del éxito
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
      //   logger.error('El productor no está conectado para envío asincrónico con callback');
      return;
    }

    this.producer.send({
      topic: this.topic,
      messages: [{ value: message }],
      acks: -1
    }).then(result => {
      //   logger.info(`Mensaje enviado y confirmado (asincrónico con callback): ${message}`);
      result.forEach(res => {
        // logger.info(`Confirmación recibida: Topic ${res.topicName}, Partition ${res.partition}, Offset ${res.baseOffset}`);
      });
    }).catch(error => {
      //   logger.error('Error en envío asincrónico con callback:', error);
    });
  }


  async sendSyncMultiple(message: string, times = 5) {
    if (!this.isConnected) {
      //   logger.error('El productor no está conectado para envío sincrónico');
      return;
    }
    for (let i = 1; i <= times; i++) {
      try {
        const sendResult = await this.producer.send({
          topic: this.topic,
          messages: [{ value: `${message} | Envío número ${i}` }],
          acks: 1
        });
        // logger.info(`Mensaje ${i} enviado y confirmado (sincrónico): ${message}`);
        sendResult.forEach(result => {
          //   logger.info(`Confirmación recibida para mensaje ${i}: Topic ${result.topicName}, Partition ${result.partition}, Offset ${result.baseOffset}`);
        });
      } catch (error) {
        // logger.error(`Error en envío sincrónico del mensaje ${i}:`, error);
      }
    }
  }
}
