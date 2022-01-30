import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class ZoneQueryInput {
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
