import {  GetTransactioDTO } from "../dto/GetTransactioDTO";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";

export interface IGetTransactionByIdUseCase {
    execute(imputQuery: GetTransactioDTO): Promise<TransactioAppDto | null>;
}