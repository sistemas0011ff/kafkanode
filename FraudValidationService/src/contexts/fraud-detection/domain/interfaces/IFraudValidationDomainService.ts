import { TransactionCreatedDomainEvent } from '../events/TransactionCreatedDomainEvent';
import { TransactionStatusUpdatedDto } from '../dto/TransactionStatusUpdatedDto';

export interface IFraudValidationDomainService {
    validateTransaction(event: TransactionCreatedDomainEvent): TransactionStatusUpdatedDto;
}
