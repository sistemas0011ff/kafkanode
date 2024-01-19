import { Inject, Service, Token } from "typedi";
import { IQueryHandler } from "../../../../contexts/shared/cqrs/IQueryHandler";
import { TransactionRepositoryToken } from "../../infraestructure/repositories/TransactionRepository";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";
import { GetAllTransactionsQuery } from "./GetAllTransactionsQuery";
import { GetTransactionInfraestructureDto } from "../../domain/dto/GetTransactionInfraestructureDto";
import { ITransactionRepository } from "../../domain/interfaces/ITransactionRepository";

export const GetAllTransactionsQueryHandlerToken = new Token<GetAllTransactionsQueryHandler>();   

@Service()
export class GetAllTransactionsQueryHandler implements IQueryHandler<GetAllTransactionsQuery, TransactioAppDto[]> {

    constructor(
        @Inject(TransactionRepositoryToken)
        private transactionRepository: ITransactionRepository
    ){}

    async execute(query: GetAllTransactionsQuery): Promise<TransactioAppDto[]> {
        const transactions = await this.transactionRepository.getAll();
        return transactions.map(transaction => this.mapToTransactioAppDto(transaction));
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
            message: transaction.updatedAt ? transaction.updatedAt.toString() : undefined
        };
    }
}
