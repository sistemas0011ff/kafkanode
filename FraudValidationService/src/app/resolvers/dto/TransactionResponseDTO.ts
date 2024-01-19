import { Field, ObjectType, Int, Float } from 'type-graphql';

@ObjectType()
class TransactionResponseDTO {
    @Field(() => Int)
    transaction_id: number;

    @Field()
    account_external_id_debit: string;

    @Field()
    account_external_id_credit: string;

    @Field(() => Int)
    transfer_type_id: number;

    @Field(() => Float)
    value: number;

    @Field()
    status: string;

    @Field()
    created_at: Date;

    @Field({ nullable: true })
    updated_at?: Date;
}

export { TransactionResponseDTO };
