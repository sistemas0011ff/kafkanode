import { CreateTransactionInfraestructureDto } from "../dto/CreateTransactionInfraestructureDto";
import { GetTransactionInfraestructureDto } from "../dto/GetTransactionInfraestructureDto";

export interface ITransactionRepository {
  save(input: CreateTransactionInfraestructureDto): Promise<number>;
  getById(transactionId: number): Promise<GetTransactionInfraestructureDto | null> ;
  getAll(): Promise<GetTransactionInfraestructureDto[]>; 

}
