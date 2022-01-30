import { Inject, Injectable, Logger } from '@nestjs/common';
import { EventRepository } from '../repositories/event.repository';
import { CreateEventInput } from '../inputs/create-event.input';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { EVENT_ADDED } from '../resolvers/event.resolver';

@Injectable()
export class EventService {
  private logger = new Logger();

  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private eventRepo: EventRepository,
  ) {}

  async info(dto: CreateEventInput): Promise<void> {
    this.logger.log(dto.message, `${EventService.name}:${dto.context}`);
    await this.create(dto);
  }

  async debug(dto: CreateEventInput): Promise<void> {
    this.logger.debug(dto.message, `${EventService.name}:${dto.context}`);
    await this.create({ ...dto, isDebugMessage: true });
  }

  private async create(dto: CreateEventInput): Promise<void> {
    const eventAdded = await this.eventRepo.save(this.eventRepo.create(dto));
    this.pubSub.publish(EVENT_ADDED, { eventAdded });
  }

  @Cron(CronExpression.EVERY_DAY_AT_NOON)
  private async replaceEventsToClickhouse() {
    if ((await this.eventRepo.count()) > 1000) {
      console.log('replace');
    }
  }
}
