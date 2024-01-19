import { ObjectType, Field } from 'type-graphql';

@ObjectType()
export class GQConfirmation {
    @Field()
    success: boolean;

    @Field()
    responseCode: string;

    @Field()
    message: string;

    @Field()
    id: string;
}
