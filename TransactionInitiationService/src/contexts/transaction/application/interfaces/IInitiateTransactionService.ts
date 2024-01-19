import { GQConfirmation } from "../../../../contexts/shared/application/response/GQConfirmation";
import { TransactionServiceInputDto } from "../dto/TransactionServiceInputDto";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";

export interface IInitiateTransactionService {
    process(inputObject: TransactionServiceInputDto) : Promise<GQConfirmation>;
    getById(id: number): Promise<TransactioAppDto | null>;
    getAllTransactions(): Promise<TransactioAppDto[]>; 

}