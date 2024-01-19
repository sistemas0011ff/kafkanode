import { ICommand } from "../../../../contexts/shared/cqrs/ICommand"; 
import { UpdateTransactionDTO } from "../dto/UpdateTransactionDTO";

export class UpdateTransactionCommand implements ICommand {

    public updateTransactionDTO: UpdateTransactionDTO;

    constructor(input: UpdateTransactionDTO) {
      this.updateTransactionDTO = input;
    }

    validate(): void | Promise<void> {
        throw new Error("Method not implemented.");
    }
}