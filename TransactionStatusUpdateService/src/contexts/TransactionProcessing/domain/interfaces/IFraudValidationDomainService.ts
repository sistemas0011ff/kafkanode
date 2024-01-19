import { TransactionUpdatedDomainEvent } from '../events/TransactionUpdatedDomainEvent';
import { TransactionStatusUpdatedDto } from '../dto/TransactionStatusUpdatedDto';

export interface IFraudValidationDomainService {
    validateTransaction(event: TransactionUpdatedDomainEvent): TransactionStatusUpdatedDto;
}
