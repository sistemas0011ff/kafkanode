import { Inject, Service, Token } from "typedi";
import { IQueryHandler } from "../../../../contexts/shared/cqrs/IQueryHandler";
import { IGetTransactionByIdUseCase } from "../interfaces/IGetTransactionByIdUseCase";
import { GetTransactioDTO } from "../dto/GetTransactioDTO";
import { TransactioAppDto } from "../dto/response/TransactioAppDto";
import { GetTransactionByIdQuery } from "../queries/GetTransactionByIdQuery";
import { GetTransactionByIdQueryHandlerToken } from "../queries/GetTransactionByIdQueryHandler";

export const IGetTransactionByIdUseCaseToken = new Token<IGetTransactionByIdUseCase>();

@Service(IGetTransactionByIdUseCaseToken)
export class GetTransactionByIdUseCase implements IGetTransactionByIdUseCase {

    public constructor(
        @Inject(GetTransactionByIdQueryHandlerToken)
        private queryHandler: IQueryHandler<GetTransactionByIdQuery,TransactioAppDto>){
    }

    async execute(imputQuery: GetTransactioDTO): Promise<TransactioAppDto> { 
        const query = new GetTransactionByIdQuery(imputQuery);
        await query.validate();       
        let result : TransactioAppDto = await  this.queryHandler.execute(query); 
        return result;
    }
}