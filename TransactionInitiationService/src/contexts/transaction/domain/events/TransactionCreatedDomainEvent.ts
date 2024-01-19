import { DomainEvent } from '../../../../contexts/shared/domain/events/DomainEvent'; 
import { TransactionCreatedEventDto } from '../dto/TransactionCreatedEventDto';

export class TransactionCreatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'transaction.created';

  constructor(
    public readonly transactionId: number,
    public readonly accountExternalIdDebit: string,
    public readonly accountExternalIdCredit: string,
    public readonly transferTypeId: number,
    public readonly value: number,
    public readonly status: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly aggregateId: string,
    public readonly occurredOn: Date = new Date()
  ) {
    super(TransactionCreatedDomainEvent.EVENT_NAME, aggregateId, undefined, occurredOn);
  }

  toPrimitive(): TransactionCreatedEventDto {
    return {
      eventName: this.eventName,
      transactionId: this.transactionId,
      accountExternalIdDebit: this.accountExternalIdDebit,
      accountExternalIdCredit: this.accountExternalIdCredit,
      transferTypeId: this.transferTypeId,
      value: this.value,
      status: this.status,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
      aggregateId: this.aggregateId,
      occurredOn: this.occurredOn.toISOString(),
    };
  }

  static fromPrimitives(data: TransactionCreatedEventDto): TransactionCreatedDomainEvent {
    return new TransactionCreatedDomainEvent(
      data.transactionId,
      data.accountExternalIdDebit,
      data.accountExternalIdCredit,
      data.transferTypeId,
      data.value,
      data.status,
      new Date(data.createdAt),
      new Date(data.updatedAt),
      data.aggregateId,
      new Date(data.occurredOn)
    );
  }
}
