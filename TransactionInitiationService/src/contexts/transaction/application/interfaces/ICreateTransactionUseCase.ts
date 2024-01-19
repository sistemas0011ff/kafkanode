import { GQConfirmation } from "../../../../contexts/shared/application/response/GQConfirmation";
import { CreateTransactionDTO } from "../dto/CreateTransactionDTO";

export interface ICreateTransactionUseCase {
  execute(input: CreateTransactionDTO): Promise<GQConfirmation>;
}
