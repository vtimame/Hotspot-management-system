import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class EventEntitiesType {
  @Field(() => Int, { nullable: true })
  userId?: number;

  @Field(() => Int, { nullable: true })
  clientId?: number;

  @Field(() => Int, { nullable: true })
  zoneId?: number;

  @Field(() => Int, { nullable: true })
  zonePageId?: number;

  @Field(() => Int, { nullable: true })
  guestAttemptId?: number;

  @Field(() => Int, { nullable: true })
  guestAuthId?: number;

  @Field(() => Int, { nullable: true })
  guestDeviceId?: number;

  @Field(() => Int, { nullable: true })
  guestSessionId?: number;
}
