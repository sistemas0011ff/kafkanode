import { UpdateTransactionInfraestructureDto } from "../dto/UpdateTransactionInfraestructureDto";
import { GetTransactionInfraestructureDto } from "../dto/GetTransactionInfraestructureDto";

export interface ITransactionRepository {
  save(input: UpdateTransactionInfraestructureDto): Promise<number>;
  getById(transactionId: number): Promise<GetTransactionInfraestructureDto | null> ;
  getAll(): Promise<GetTransactionInfraestructureDto[]>; 
  updateStatus(transactionId: number, status: string): Promise<void>;
}
