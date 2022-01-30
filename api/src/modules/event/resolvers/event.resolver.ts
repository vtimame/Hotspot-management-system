import { Resolver, Query, Args, Subscription } from '@nestjs/graphql';
import { Event } from '../entities/event';
import { EventRepository } from '../repositories/event.repository';
import { EventsInput } from '../inputs/events.input';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import * as dayjs from 'dayjs';
import * as isBetween from 'dayjs/plugin/isBetween';

export const EVENT_ADDED = 'eventAdded';

dayjs.extend(isBetween);
@Resolver(() => Event)
export class EventResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private eventRepo: EventRepository,
  ) {}

  @Query(() => [Event], { nullable: true })
  async events(
    @Args('filter', { nullable: true })
    filter: EventsInput,
  ): Promise<Event[]> {
    return this.eventRepo.findMany(filter);
  }

  @Subscription(() => Event, {
    filter: (
      payload: { eventAdded: Event },
      variables: { filter: EventsInput },
    ) => {
      let entitiesCondition = true;
      let debugCondition = true;
      let betweenCondition = true;

      if (variables?.filter?.entities) {
        Object.keys(variables.filter.entities).forEach((key) => {
          if (
            payload.eventAdded.entities[key] !== variables.filter.entities[key]
          ) {
            entitiesCondition = false;
          }
        });
      }

      if (variables?.filter?.withoutDebugMessages) {
        debugCondition = payload.eventAdded.isDebugMessage === false;
      }

      if (variables?.filter?.between) {
        betweenCondition = dayjs(payload.eventAdded.createdAt).isBetween(
          variables.filter.between.createdAtFrom,
          variables.filter.between.createdAtTo,
        );
      }

      return entitiesCondition && debugCondition && betweenCondition;
    },
  })
  async eventAdded(@Args('filter', { nullable: true }) filter?: EventsInput) {
    return this.pubSub.asyncIterator(EVENT_ADDED);
  }
}
