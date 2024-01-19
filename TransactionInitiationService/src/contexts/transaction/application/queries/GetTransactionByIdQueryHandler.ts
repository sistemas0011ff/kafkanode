import { Inject, Service, Token } from "typedi";
import { IQueryHandler } from "../../../../contexts/shared/cqrs/IQueryHandler";
import { TransactionRepositoryToken } from "../../infraestructure/repositories/TransactionRepository";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";
import { GetTransactionByIdQuery } from "./GetTransactionByIdQuery"; 
import { GetTransactionInfraestructureDto } from "../../domain/dto/GetTransactionInfraestructureDto";
import { ITransactionRepository } from "../../domain/interfaces/ITransactionRepository";

export const GetTransactionByIdQueryHandlerToken = new Token<GetTransactionByIdQueryHandler>();   

@Service()
export class GetTransactionByIdQueryHandler implements IQueryHandler<GetTransactionByIdQuery, TransactioAppDto> {

    constructor(
        @Inject(TransactionRepositoryToken)
        private transactionRepository: ITransactionRepository
    ){}

    async execute(query: GetTransactionByIdQuery): Promise<TransactioAppDto> {
        query.validate();
        const transaction: GetTransactionInfraestructureDto = await this.transactionRepository.getById(query.getQuery.id);

        if (!transaction) {
            throw new Error("Transaction not found");
        }

        return this.mapToTransactioAppDto(transaction);
    }

    private mapToTransactioAppDto(transaction: GetTransactionInfraestructureDto): TransactioAppDto {
        return {
            transactionId: transaction.transactionId,
            accountExternalIdDebit: transaction.accountExternalIdDebit,
            accountExternalIdCredit: transaction.accountExternalIdCredit,
            transferTypeId: transaction.transferTypeId,
            value: transaction.value,
            status: transaction.status,
            createdAt: transaction.createdAt,
            message: transaction.updatedAt ? transaction.updatedAt.toString() : undefined // Manejo de campo opcional
        };
    }
    
}
