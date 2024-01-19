import { ObjectType, Field, Int } from 'type-graphql';

/**
 * DTO for the response of a transaction creation.
 */
@ObjectType({ description: 'Data Transfer Object (DTO) for the response of a transaction creation.' })
export class TransactionResDto {
  /**
   * The unique identifier of the transaction.
   */
  @Field(() => Int, { description: 'The unique identifier of the transaction.' })
  transactionId: number;

  /**
   * The external ID of the debit account.
   */
  @Field({ description: 'The external ID of the debit account.' })
  accountExternalIdDebit: string;

  /**
   * The external ID of the credit account.
   */
  @Field({ description: 'The external ID of the credit account.' })
  accountExternalIdCredit: string;

  /**
   * The ID of the transfer type.
   */
  @Field(() => Int, { description: 'The ID of the transfer type.' })
  transferTypeId: number;

  /**
   * The value of the transaction.
   */
  @Field(() => Int, { description: 'The value of the transaction.' })
  value: number;

  /**
   * The status of the transaction.
   */
  @Field({ nullable: true, description: 'The status of the transaction.' })
  status?: string;

  /**
   * Timestamp of when the transaction was created.
   */
  @Field({ description: 'Timestamp of when the transaction was created.' })
  createdAt: Date;

  /**
   * Additional message or information about the transaction.
   */
  // @Field({ nullable: true, description: 'Additional message or information about the transaction.' })
  // message?: string;
}
