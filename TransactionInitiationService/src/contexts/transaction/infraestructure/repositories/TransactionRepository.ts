import { Inject, Service, Token } from "typedi";
import { PrismaService } from "../../../../contexts/shared/infrastructure/orm/prisma/PrismaService";
import { PrismaClient } from "@prisma/client";
import { GetTransactionInfraestructureDto } from "../../domain/dto/GetTransactionInfraestructureDto";
import { ITransactionRepository } from "../../domain/interfaces/ITransactionRepository";
import { CreateTransactionInfraestructureDto } from "../../domain/dto/CreateTransactionInfraestructureDto";

export const TransactionRepositoryToken = new Token<TransactionRepository>();
const PrismaClientToken = new Token<PrismaClient>();

@Service(TransactionRepositoryToken)
export class TransactionRepository implements ITransactionRepository {

  constructor(
    @Inject(PrismaClientToken)
    private prisma: PrismaService
  ) { }

  async save(transactionInput: CreateTransactionInfraestructureDto): Promise<number> {
    try {
 
      const createdTransaction = await this.prisma.transaction.create({
        data: {
          account_external_id_debit: transactionInput.accountExternalIdDebit,
          account_external_id_credit: transactionInput.accountExternalIdCredit,
          transfer_type_id: transactionInput.transferTypeId,
          value: transactionInput.value,
          status: transactionInput.status || 'pending', 
        }
      });
 
      return createdTransaction.transaction_id;  
    } catch (error) {
      console.error('Error saving transaction:', error);
      throw error;
    }
  }
  async getById(transactionId: number): Promise<GetTransactionInfraestructureDto | null> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { transaction_id: transactionId },
      });
  
      if (!transaction) {
        return null;
      }
  
      return new GetTransactionInfraestructureDto(
        transaction.transaction_id,
        transaction.account_external_id_debit,
        transaction.account_external_id_credit,
        transaction.transfer_type_id,
        transaction.value.toNumber(),  
        transaction.status,
        transaction.created_at,
        transaction.updated_at
      );
    } catch (error) {
      console.error('Error retrieving transaction:', error);
      throw error;
    }
  }

  async getAll(): Promise<GetTransactionInfraestructureDto[]> {
    const transactions = await this.prisma.transaction.findMany();
    return transactions.map(t => new GetTransactionInfraestructureDto(
        t.transaction_id,
        t.account_external_id_debit,
        t.account_external_id_credit,
        t.transfer_type_id,
        t.value.toNumber(),
        t.status,
        t.created_at,
        t.updated_at
    ));
}
  
}
