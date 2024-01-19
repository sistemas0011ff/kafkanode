import { TransactioAppDto } from "../dto/response/TransactioAppDto";
import { TransactionResponseDTO } from "../../../../app/resolvers/dto/TransactionResponseDTO";

export function convertDtoApplicationResponse(data: TransactioAppDto): TransactionResponseDTO {
    let appDto = new TransactionResponseDTO();

    appDto.transaction_id = data.transactionId;
    appDto.account_external_id_debit = data.accountExternalIdDebit;
    appDto.account_external_id_credit = data.accountExternalIdCredit;
    appDto.transfer_type_id = data.transferTypeId;
    appDto.value = data.value;
    appDto.status = data.status;
    appDto.created_at = data.createdAt;
    appDto.updated_at = data.message ? new Date(data.message) : undefined;

    return appDto;
}
