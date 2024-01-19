import { DomainEventClass, DomainEventSubscriber } from "../../../../contexts/shared/domain/events";
import { Inject, Service, Token } from "typedi";
import { TransactionCreatedDomainEvent } from "../../domain/events/TransactionCreatedDomainEvent";
import { KafkaServiceToken } from "../../../../contexts/shared/infrastructure/kafka/KafkaService";
import { IKafkaService } from "../../../../contexts/shared/infrastructure/interfaces/IKafkaService";
import { config } from "../../../../app/config";
 
export const TransactionCreatedSubscriberToken = new Token<TransactionCreatedSubscriber>();

@Service({ id: TransactionCreatedSubscriberToken })
export class TransactionCreatedSubscriber implements DomainEventSubscriber<TransactionCreatedDomainEvent> {
    private kafkaService: IKafkaService;
    private kafkaTopic: string;

    constructor(@Inject(KafkaServiceToken) kafkaService: IKafkaService) {
        this.kafkaService = kafkaService;
        this.kafkaTopic = config.get('kafka.topic');  
    }

    subscribedTo(): Array<DomainEventClass> {
        return [TransactionCreatedDomainEvent];
    }

    async on(event: TransactionCreatedDomainEvent): Promise<void> {

        try {
            await this.kafkaService.connect();
            await this.kafkaService.initTransaction();
            await this.kafkaService.addToTransaction(this.kafkaTopic, { value: JSON.stringify(event) });
            await this.kafkaService.endTransaction(true);
        } catch (error) {
            console.error(`Error handling event: ${event.eventName}`, error);
            try {
                await this.kafkaService.endTransaction(false);
            } catch (rollbackError) {
                console.error(`Error during transaction rollback: ${rollbackError.message}`, rollbackError);
            }
            throw new Error(`Failed to handle event: ${event.eventName}. Original error: ${error.message}`);
        }
    }
}
