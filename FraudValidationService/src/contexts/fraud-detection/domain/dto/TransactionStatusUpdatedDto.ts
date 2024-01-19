export class TransactionStatusUpdatedDto {
    constructor(
        public readonly transactionId: number,
        public readonly accountExternalIdDebit: string,
        public readonly accountExternalIdCredit: string,
        public readonly transferTypeId: number,
        public readonly value: number,
        public readonly status: string,  
        public readonly createdAt: Date,
        public readonly updatedAt: string,  
        public readonly aggregateId: string,
        public readonly occurredOn: Date,
        public readonly updatedBy?: string,  
        public readonly reason?: string  
    ) {}
}
