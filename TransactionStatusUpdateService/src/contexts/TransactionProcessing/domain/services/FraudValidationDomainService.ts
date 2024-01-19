import { Service, Token } from 'typedi'; 
import { TransactionUpdatedDomainEvent } from '../events/TransactionUpdatedDomainEvent';
import { TransactionStatusUpdatedDto } from '../dto/TransactionStatusUpdatedDto';
import { IFraudValidationDomainService } from '../interfaces/IFraudValidationDomainService';

export const FraudValidationDomainServiceToken = new Token<IFraudValidationDomainService>();

@Service(FraudValidationDomainServiceToken)
export class FraudValidationDomainService implements IFraudValidationDomainService {
    public validateTransaction(event: TransactionUpdatedDomainEvent): TransactionStatusUpdatedDto {
        const status = event.value > 1000 ? 'rejected' : 'approved';
        return new TransactionStatusUpdatedDto(
            event.transactionId,
            event.accountExternalIdDebit,
            event.accountExternalIdCredit,
            event.transferTypeId,
            event.value,
            status,  
            event.createdAt,
            new Date().toISOString(), 
            event.aggregateId,
            event.occurredOn
        );
    }
}
