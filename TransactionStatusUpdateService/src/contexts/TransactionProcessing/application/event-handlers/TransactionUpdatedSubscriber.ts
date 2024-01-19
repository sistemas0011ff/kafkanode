import { DomainEventClass, DomainEventSubscriber } from "../../../../contexts/shared/domain/events";
import { Inject, Service, Token } from "typedi";
import { TransactionUpdatedDomainEvent } from "../../domain/events/TransactionUpdatedDomainEvent";
import { UpdateTransactionCommandHandler, UpdateTransactionCommandHandlerToken } from "../commands/UpdateTransactionCommandHandler";
import { UpdateTransactionCommand } from "../commands/UpdateTransactionCommand";

export const TransactionUpdateSubscriberToken = new Token<TransactionUpdateSubscriber>();

@Service({ id: TransactionUpdateSubscriberToken })
export class TransactionUpdateSubscriber implements DomainEventSubscriber<TransactionUpdatedDomainEvent> {
    
    constructor(
        @Inject(UpdateTransactionCommandHandlerToken) private commandHandler: UpdateTransactionCommandHandler
    ) {
    }

    subscribedTo(): Array<DomainEventClass> {
        return [TransactionUpdatedDomainEvent];
    } 

    async on(event: TransactionUpdatedDomainEvent): Promise<void> {

        try { 
            const command = new UpdateTransactionCommand({
                transactionId: event.transactionId,
                accountExternalIdDebit: event.accountExternalIdDebit,
                accountExternalIdCredit: event.accountExternalIdCredit,
                transferTypeId: event.transferTypeId,
                value: event.value,
                status: event.status,  
                createdAt: event.createdAt
            });
 
            await this.commandHandler.handle(command);

            console.log(`Transaction status updated for event: ${event.eventName}`);
        } catch (error) {
            console.error(`Error handling event: ${event.eventName}`, error);
            throw new Error(`Failed to handle event: ${event.eventName}. Original error: ${error.message}`);
        }
    }

    
}