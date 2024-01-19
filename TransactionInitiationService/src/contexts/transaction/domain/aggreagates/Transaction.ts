export class Transaction {
    transaction_id: number;
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    status?: string;
}
