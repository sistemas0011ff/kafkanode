import { ICommand } from "../../../../contexts/shared/cqrs/ICommand"; 
import { CreateTransactionDTO } from "../dto/CreateTransactionDTO";

export class CreateTransactionCommand implements ICommand {

    public createTransactionDTO: CreateTransactionDTO;

    constructor(input: CreateTransactionDTO) {
      this.createTransactionDTO = input;
    }

    validate(): void | Promise<void> {
        throw new Error("Method not implemented.");
    }
}