import { TransactioAppDto } from "../dto/response/TransactioAppDto";

export interface IGetAllTransactionsUseCase {
    execute(): Promise<TransactioAppDto[]>;
}
