import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class GuestSessionsInput {
  @Field()
  zoneId: number;

  @Field()
  issuedFrom: Date;

  @Field()
  issuedTo: Date;

  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
