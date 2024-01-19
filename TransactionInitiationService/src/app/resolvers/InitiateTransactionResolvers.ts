import { Service, Inject, Token } from 'typedi';
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import  { TransactionInputDto } from "./dto/TransactionInputDto";
import { IInitiateTransactionService } from "../../contexts/transaction/application/interfaces/IInitiateTransactionService";
import { GQConfirmation } from '../../contexts/shared/application/response/GQConfirmation';
import { ApolloError } from 'apollo-server';
import { CustomNotFoundException } from '../../contexts/shared/infrastructure/exceptions/CustomNotFoundException';
import { CustomBadRequestException } from '../../contexts/shared/infrastructure/exceptions/CustomBadRequestException';
import { BadRequestError } from '../../contexts/shared/infrastructure/exceptions/BadRequestError';
import { NotFoundError } from '../../contexts/shared/infrastructure/exceptions/NotFoundError';
import { TransactionResDto } from './dto/response/TransactionResDto';
import { TransactionServiceDto } from './dto/TransactionServiceDto';
import { convertToServiceInput } from './services/convertToServiceInput';
import { TransactionServiceInputDto } from '../../contexts/transaction/application/dto/TransactionServiceInputDto';

const IInitiateTransactionService = new Token<IInitiateTransactionService>();

@Service()
@Resolver()
export class InitiateTransactionResolvers {

  public constructor(
    @Inject(IInitiateTransactionService)
    private readonly initiateTransactionService: IInitiateTransactionService,
  ) { }

  @Mutation(() => GQConfirmation)
  async create(@Arg('TransactionInputDto') transactionDtoInput: TransactionInputDto): Promise<GQConfirmation> {

    try {
      const serviceInput: TransactionServiceInputDto = {
        ...transactionDtoInput,
        status: 'pending',
      };
      return await this.initiateTransactionService.process(serviceInput);
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof BadRequestError) {
        throw new CustomBadRequestException(error.message);
      } else if (error instanceof Error) { 
        throw new ApolloError("An unexpected error occurred");
      } else {
        throw new ApolloError(error.message);
      }
    }
  }

  @Query(() => TransactionResDto, { nullable: true })
  async getById(@Arg("id") id: number): Promise<TransactionResDto | null> {
      return await this.initiateTransactionService.getById(id);
  }
 
  @Query(() => [TransactionResDto])
  async getAllTransactions(): Promise<TransactionResDto[]> {
    try {
      return await this.initiateTransactionService.getAllTransactions();
    } catch (error) {
      if (error instanceof NotFoundError) {
        throw new CustomNotFoundException(error.message);
      } else if (error instanceof BadRequestError) {
        throw new CustomBadRequestException(error.message);
      } else if (error instanceof Error) { 
        throw new ApolloError("An unexpected error occurred");
      } else {
        throw new ApolloError(error.message);
      }
    }
  }
}