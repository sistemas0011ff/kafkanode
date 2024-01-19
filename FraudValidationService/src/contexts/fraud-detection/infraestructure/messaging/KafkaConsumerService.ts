import { Service, Inject, Token } from 'typedi';
import { IKafkaConsumerService } from '../interfaces/IKafkaConsumerService';
import { EventBus } from '../../../../contexts/shared/domain/events';
import { EventBusToken } from '../../../../contexts/shared/infrastructure/eventBus/inmemory/InMemoryAsyncEventBus';
import { KafkaServiceToken } from '../../../../contexts/shared/infrastructure/kafka/KafkaService';
import { IKafkaService } from '../../../../contexts/shared/infrastructure/interfaces/IKafkaService';
import { TransactionCreatedDomainEvent } from '../../domain/events/TransactionCreatedDomainEvent';

export const KafkaConsumerServiceToken = new Token<KafkaConsumerService>();

@Service(KafkaConsumerServiceToken) 
export class KafkaConsumerService implements IKafkaConsumerService {
  private topic: string;

  constructor(
    @Inject(KafkaServiceToken) private kafkaService: IKafkaService,
    @Inject(EventBusToken) private eventBus: EventBus,
    @Inject('KafkaTopic') topic: string
  ) { 
    this.topic = topic;
    console.log(`KafkaConsumerService iniciado para el tópico: ${this.topic}`);
  }

  public async start(): Promise<void> {
    try {
      console.log('Conectándose al broker de Kafka...');
      await this.kafkaService.connectConsumer();
      console.log('Conexión exitosa. Suscribiéndose al tópico...');

      await this.kafkaService.subscribeToTopic(this.topic);
      console.log(`Suscripción al tópico ${this.topic} exitosa. Iniciando consumo...`);
     // await this.kafkaService.consumeMessages();
       
      await this.kafkaService.consumeMessagesv2(this.topic,async (payload) => {
        console.log("Procesando mensaje de Kafka...");
    
        if (payload.message.value) {
          console.log("Mensaje de Kafka recibido:", payload.message.value.toString());
        try {
            const event = this.transformToDomainEvent(payload.message);
            if (event) {
            console.log("Evento transformado para publicar:", event.toPrimitive());
                this.eventBus.publish([event]);
            } else {
              console.log("No se pudo transformar el mensaje de Kafka en un evento de dominio.");
            }
          } catch (error) {
            console.error('Error al procesar mensaje de Kafka:', error);
          }
        } else {
          console.log("Mensaje de Kafka sin contenido.");
        }
      });
      
    } catch (error) {
      console.error('Error al iniciar KafkaConsumerService:', error);
    }
  }

  private transformToDomainEvent(kafkaMessage): TransactionCreatedDomainEvent | null {
    try {
      const data = JSON.parse(kafkaMessage.value.toString());
      return TransactionCreatedDomainEvent.fromPrimitives(data);
    } catch (error) {
      console.error('Error al transformar mensaje de Kafka en evento de dominio:', error);
      return null;
    }
  }
}