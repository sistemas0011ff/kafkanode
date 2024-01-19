import { Inject, Service, Token } from "typedi";
import { ICommandHandler } from "../../../../contexts/shared/cqrs/ICommandHandler";
import { UpdateTransactionCommand } from "./UpdateTransactionCommand";
import { ICommandResult } from "../../../../contexts/shared/cqrs/ICommandResult";
import { GQConfirmation } from "../../../../contexts/shared/application/response/GQConfirmation";
import { TransactionRepositoryToken } from "../../infraestructure/repositories/TransactionRepository";
import { ITransactionRepository } from "../../domain/interfaces/ITransactionRepository";

export const UpdateTransactionCommandHandlerToken = new Token<UpdateTransactionCommandHandler>();

@Service(UpdateTransactionCommandHandlerToken)
export class UpdateTransactionCommandHandler implements ICommandHandler<UpdateTransactionCommand, ICommandResult<boolean, GQConfirmation>> {
    
    constructor(
        @Inject(TransactionRepositoryToken) 
        private transactionRepository: ITransactionRepository,
 
    ) { 
    }

    async handle(command: UpdateTransactionCommand): Promise<ICommandResult<boolean, GQConfirmation>> {
        try { 
            await this.transactionRepository.updateStatus(command.updateTransactionDTO.transactionId, command.updateTransactionDTO.status);
     
            return {
                result: true,
                value: {
                    success: true,
                    responseCode: "0",
                    message: "Transaction status updated successfully",
                    id: String(command.updateTransactionDTO.transactionId)
                }
            };
        } catch (error) {
            console.error("Error in UpdateTransactionCommandHandler.handle(): ", error);
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