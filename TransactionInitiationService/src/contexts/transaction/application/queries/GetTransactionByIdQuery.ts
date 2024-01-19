import { IQuery } from "../../../../contexts/shared/cqrs/IQuery";
import { GetTransactioDTO } from "../dto/GetTransactioDTO";

export class GetTransactionByIdQuery implements IQuery {

    public getQuery : GetTransactioDTO ;

    constructor(inputQuery: GetTransactioDTO){
        this.getQuery = inputQuery;
    }

    validate(): void | Promise<void> {
        if (!this.getQuery.id) {
            throw new Error("Id is missing");
        }
    }
}