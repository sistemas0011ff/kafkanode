import { Inject, Service, Token } from 'typedi';
import { IInitiateTransactionService } from "../interfaces/IInitiateTransactionService";
import { TransactionServiceInputDto } from '../dto/TransactionServiceInputDto'; 
import { CreateTransactionDTO } from '../dto/CreateTransactionDTO';
import { convertToServiceApplicationInput } from './convertToServiceApplicationInput';
import { GQConfirmation } from '../../../../contexts/shared/application/response/GQConfirmation';
import { ICreateTransactionUseCase } from '../interfaces/ICreateTransactionUseCase';
import { IGetTransactionByIdUseCaseToken } from '../usecases/GetTransactionByIdUseCase';
import { IGetTransactionByIdUseCase } from '../interfaces/IGetTransactionByIdUseCase';
import { GetTransactioDTO } from '../dto/GetTransactioDTO';
import { TransactioAppDto } from '../dto/response/TransactioAppDto';
import { IGetAllTransactionsUseCaseToken } from '../usecases/GetAllTransactionsUseCase';
import { IGetAllTransactionsUseCase } from '../interfaces/IGetAllTransactionsUseCase';

export const IInitiateTransactionServiceToken = new Token<IInitiateTransactionService>();
export const ICreateTransactionUseCaseToken = new Token<ICreateTransactionUseCase>(); 


@Service(IInitiateTransactionServiceToken)
export class TransactionService implements IInitiateTransactionService {

    public constructor(
        @Inject(ICreateTransactionUseCaseToken)
        private readonly createTransactionUseCase: ICreateTransactionUseCase,

        @Inject(IGetTransactionByIdUseCaseToken)
        private readonly getTransactionByIdUseCase: IGetTransactionByIdUseCase,

        @Inject(IGetAllTransactionsUseCaseToken)
        private readonly getAllTransactionsUseCase: IGetAllTransactionsUseCase 
    ){
    }

    async process(inputObject: TransactionServiceInputDto) : Promise<GQConfirmation>{    
        const objetCreate : CreateTransactionDTO = convertToServiceApplicationInput(inputObject);
        let result = await this.createTransactionUseCase.execute(objetCreate);
        return result;
    }

    async getById(id: number): Promise<TransactioAppDto> {
        const inputQuery = new GetTransactioDTO();
        inputQuery.id = id;
        let result :TransactioAppDto = await this.getTransactionByIdUseCase.execute(inputQuery)
        return result;
    }
    async getAllTransactions(): Promise<TransactioAppDto[]> {
        return await this.getAllTransactionsUseCase.execute();  
    }
}