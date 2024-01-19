import { ObjectType, Field, Int } from 'type-graphql';

/**
 * DTO for the response of a transaction creation.
 */
@ObjectType({ description: 'Data Transfer Object (DTO) for the response of a transaction creation.' })
export class TransactionResDto {
 
  @Field(() => Int, { description: 'The unique identifier of the transaction.' })
  transactionId: number;
 
  @Field({ description: 'The external ID of the debit account.' })
  accountExternalIdDebit: string;
 
  @Field({ description: 'The external ID of the credit account.' })
  accountExternalIdCredit: string;
 
  @Field(() => Int, { description: 'The ID of the transfer type.' })
  transferTypeId: number;

  
  @Field(() => Int, { description: 'The value of the transaction.' })
  value: number;

 
  @Field({ nullable: true, description: 'The status of the transaction.' })
  status?: string;

  @Field({ description: 'Timestamp of when the transaction was created.' })
  createdAt: Date;

  
  @Field({ nullable: true, description: 'Additional message or information about the transaction.' })
  message?: string;
}
