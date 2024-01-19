import { ObjectType, Field } from "type-graphql";

@ObjectType()
export class Confirmation {
    @Field()
    Id: string;

    @Field()
    message: string;
}
