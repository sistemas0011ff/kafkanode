import { IsNotEmpty, IsString, IsNumber, Min, IsOptional } from 'class-validator';

/**
 * DTO for creating a new transaction.
 */
export class TransactionServiceInputDto {
  /**
   * The external ID of the debit account.
   * Must be a non-empty string.
   */
  @IsNotEmpty()
  @IsString()
  accountExternalIdDebit: string;

  /**
   * The external ID of the credit account.
   * Must be a non-empty string.
   */
  @IsNotEmpty()
  @IsString()
  accountExternalIdCredit: string;

  /**
   * The ID of the transfer type.
   * Must be a non-empty number.
   */
  @IsNotEmpty()
  @IsNumber()
  transferTypeId: number;

  /**
   * The value of the transaction.
   * Must be a non-empty number greater than or equal to 0.
   */
  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  value: number;

  /**
   * The status of the transaction. Optional.
   * Defaults to "pending" if not provided.
   */
  @IsOptional()
  @IsString()
  status?: string;
}
