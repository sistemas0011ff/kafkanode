import { TransactionServiceInputDto } from "../../../contexts/fraud-detection/application/dto/TransactionServiceInputDto";
import { TransactionInputDto } from "../dto/TransactionInputDto";

export function convertToServiceInput(inputDto: TransactionInputDto): TransactionServiceInputDto {
    const serviceInputDto = new TransactionServiceInputDto();
    serviceInputDto.accountExternalIdDebit = inputDto.accountExternalIdDebit;
    serviceInputDto.accountExternalIdCredit = inputDto.accountExternalIdCredit;
    serviceInputDto.transferTypeId = inputDto.transferTypeId;
    serviceInputDto.value = inputDto.value;
    serviceInputDto.status = inputDto.status || 'pending'; 

    return serviceInputDto;
}
