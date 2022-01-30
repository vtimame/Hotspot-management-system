import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { EventEntitiesType } from '../types/event-entities.type';

@InputType()
export class EventEntitiesInput {
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

@InputType()
class CreatedBetween {
  @Field()
  createdAtFrom: Date;

  @Field()
  createdAtTo: Date;
}

@InputType()
export class EventsInput {
  @Field(() => Boolean, { nullable: true })
  withoutDebugMessages?: boolean;

  @Field(() => EventEntitiesInput, { nullable: true })
  entities?: EventEntitiesInput;

  @Field(() => CreatedBetween, { nullable: true })
  between?: CreatedBetween;
}
