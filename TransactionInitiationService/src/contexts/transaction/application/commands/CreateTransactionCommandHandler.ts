import { Inject, Service, Token } from "typedi";
import { ICommandHandler } from "../../../../contexts/shared/cqrs/ICommandHandler";
import { CreateTransactionCommand } from "./CreateTransactionCommand";
import { ICommandResult } from "../../../../contexts/shared/cqrs/ICommandResult";
import { GQConfirmation } from "../../../../contexts/shared/application/response/GQConfirmation";
import { TransactionRepositoryToken } from "../../infraestructure/repositories/TransactionRepository";
import { CreateTransactionInfraestructureDto } from "../../domain/dto/CreateTransactionInfraestructureDto";
import { TransactionCreatedDomainEvent } from "../../domain/events/TransactionCreatedDomainEvent";
import { EventBusToken } from "../../../../contexts/shared/infrastructure/eventBus/inmemory/InMemoryAsyncEventBus";
import { EventBus } from "../../../../contexts/shared/domain/events";
import { ITransactionRepository } from "../../domain/interfaces/ITransactionRepository";

export const CreateTransactionCommandHandlerToken = new Token<CreateTransactionCommandHandler>();

@Service(CreateTransactionCommandHandlerToken)
export class CreateTransactionCommandHandler implements ICommandHandler<CreateTransactionCommand, ICommandResult<boolean, GQConfirmation>> {
    
    private eventBus: EventBus;

    constructor(
        @Inject(TransactionRepositoryToken) 
        private transactionRepository: ITransactionRepository,
        @Inject(EventBusToken)
        eventBus: EventBus
    ) {
        this.eventBus = eventBus;
    }

    async handle(command: CreateTransactionCommand): Promise<ICommandResult<boolean, GQConfirmation>>{
        try {
            const infraDto = new CreateTransactionInfraestructureDto(
                command.createTransactionDTO.accountExternalIdDebit,
                command.createTransactionDTO.accountExternalIdCredit,
                command.createTransactionDTO.transferTypeId,
                command.createTransactionDTO.value,
                command.createTransactionDTO.status 
            );
    
            const transactionId = await this.transactionRepository.save(infraDto);
    
            const transactionCreatedEvent = new TransactionCreatedDomainEvent(
                transactionId,
                infraDto.accountExternalIdDebit,
                infraDto.accountExternalIdCredit,
                infraDto.transferTypeId,
                infraDto.value,
                infraDto.status,
                new Date(),
                new Date(),
                infraDto.accountExternalIdDebit
            ); 
            await this.eventBus.publish([transactionCreatedEvent]); 
            return {
                result: true,
                value: {
                    success: true,
                    responseCode: "0",
                    message: "Transaction Created Successfully",
                    id: String(transactionId)
                }
            };
        } catch (error) {
            console.error("Error in CreateTransactionCommandHandler.handle(): ", error);
            return { 
                result: false, 
                value: {
                    success: false,
                    responseCode: "1",
                    message: error.message,
                    id: ""
                }
            };
        }
    }
}
