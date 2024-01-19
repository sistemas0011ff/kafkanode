export class TransactioAppDto {
    /**
         * Unique identifier for the transaction.
         */
    transactionId: number;

    /**
     * The external ID of the debit account.
     */
    accountExternalIdDebit: string;

    /**
     * The external ID of the credit account.
     */
    accountExternalIdCredit: string;

    /**
     * The ID of the transfer type.
     */
    transferTypeId: number;

    /**
     * The value of the transaction.
     */
    value: number;

    /**
     * The status of the transaction.
     */
    status: string;

    /**
     * Timestamp of when the transaction was created or processed.
     */
    createdAt: Date;

    /**
     * Additional message or information about the transaction.
     */
    message?: string;
}