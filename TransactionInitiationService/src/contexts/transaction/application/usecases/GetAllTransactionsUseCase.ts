import { Inject, Service, Token } from "typedi";
import { IQueryHandler } from "../../../../contexts/shared/cqrs/IQueryHandler";
import { IGetAllTransactionsUseCase } from "../interfaces/IGetAllTransactionsUseCase";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";
import { GetAllTransactionsQuery } from "../queries/GetAllTransactionsQuery";
import { GetAllTransactionsQueryHandlerToken } from "../queries/GetAllTransactionsQueryHandler";

export const IGetAllTransactionsUseCaseToken = new Token<IGetAllTransactionsUseCase>();

@Service(IGetAllTransactionsUseCaseToken)
export class GetAllTransactionsUseCase implements IGetAllTransactionsUseCase {

    constructor(
        @Inject(GetAllTransactionsQueryHandlerToken)
        private queryHandler: IQueryHandler<GetAllTransactionsQuery, TransactioAppDto[]>
    ) {}

    async execute(): Promise<TransactioAppDto[]> {  
        const query = new GetAllTransactionsQuery();
        let result: TransactioAppDto[] = await this.queryHandler.execute(query); 
        return result;
    }
}
