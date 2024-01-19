import { InputType, Field, Int } from 'type-graphql';
import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

/**
 * DTO for creating a new transaction.
 */
@InputType({ description: 'Data Transfer Object (DTO) for creating a new transaction.' })
export class TransactionInputDto {
  /**
   * The external ID of the debit account.
   * Must be a non-empty string.
   */
  @Field({ description: 'The external ID of the debit account. Must be a non-empty string.' })
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  /**
   * The external ID of the credit account.
   * Must be a non-empty string.
   */
  @Field({ description: 'The external ID of the credit account. Must be a non-empty string.' })
  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  /**
   * The ID of the transfer type.
   * Must be a non-empty number.
   */
  @Field(type => Int, { description: 'The ID of the transfer type. Must be a non-empty number.' })
  @IsNotEmpty()
  @IsNumber()
  transferTypeId: number;

  /**
   * The value of the transaction.
   * Must be a non-empty number greater than or equal to 0.
   */
  @Field(type => Int, { description: 'The value of the transaction. Must be a non-empty number greater than or equal to 0.' })
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  /**
   * The status of the transaction. Optional.
   * Defaults to "pending" if not provided.
   */
  // @Field({ nullable: true, description: 'The status of the transaction. Optional. Defaults to "pending" if not provided.' })
  // @IsOptional()
  // @IsString()
  // status?: string;
}
