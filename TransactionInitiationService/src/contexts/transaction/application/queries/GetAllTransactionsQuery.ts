import { IQuery } from "../../../../contexts/shared/cqrs/IQuery";

export class GetAllTransactionsQuery implements IQuery {
    validate(): void | Promise<void> {
        throw new Error("Method not implemented.");
    }
     
}
