export class CreateTransactionInfraestructureDto {
    accountExternalIdDebit: string;
    accountExternalIdCredit: string;
    transferTypeId: number;
    value: number;
    status?: string;  
    createdAt?: Date; 
    updatedAt?: Date; 

    constructor(
        accountExternalIdDebit: string, 
        accountExternalIdCredit: string, 
        transferTypeId: number, 
        value: number, 
        status?: string, 
        createdAt?: Date, 
        updatedAt?: Date
    ) {
        this.accountExternalIdDebit = accountExternalIdDebit;
        this.accountExternalIdCredit = accountExternalIdCredit;
        this.transferTypeId = transferTypeId;
        this.value = value;
        this.status = status || 'pending';  
        this.createdAt = createdAt;  
        this.updatedAt = updatedAt;  
    }
}
