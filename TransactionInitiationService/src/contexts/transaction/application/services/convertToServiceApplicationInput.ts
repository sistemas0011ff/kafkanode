import { CreateTransactionDTO } from "../dto/CreateTransactionDTO";
import { TransactionServiceInputDto } from "../dto/TransactionServiceInputDto";

export function convertToServiceApplicationInput(input: TransactionServiceInputDto): CreateTransactionDTO {
    const createTransactionDTO = new CreateTransactionDTO();

    createTransactionDTO.accountExternalIdDebit = input.accountExternalIdDebit;
    createTransactionDTO.accountExternalIdCredit = input.accountExternalIdCredit;
    createTransactionDTO.transferTypeId = input.transferTypeId;
    createTransactionDTO.value = input.value;
    createTransactionDTO.status = input.status || 'pending'; 
    createTransactionDTO.createdAt = new Date(); 
    return createTransactionDTO;
}
