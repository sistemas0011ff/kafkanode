import { DomainEvent } from '../../../../contexts/shared/domain/events/DomainEvent'; 
import { TransactionUpdatedEventDto } from '../dto/TransactionUpdatedEventDto';

export class TransactionUpdatedDomainEvent extends DomainEvent {
  static EVENT_NAME = 'transaction.updated';

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
    super(TransactionUpdatedDomainEvent.EVENT_NAME, aggregateId, undefined, occurredOn);
  }

  toPrimitive(): TransactionUpdatedEventDto {
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

  static fromPrimitives(data: TransactionUpdatedEventDto): TransactionUpdatedDomainEvent {
    return new TransactionUpdatedDomainEvent(
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
 