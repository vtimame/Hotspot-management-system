import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ClientInput {
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
