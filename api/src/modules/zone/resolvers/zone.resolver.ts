import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Zone } from '../entities/zone';
import { ZoneRepository } from '../repositories/zone.repository';
import { ZonesFilter, ZonesInput } from '../inputs/zones.input';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { CreateZoneInput } from '../inputs/create-zone.input';
import { ZoneService } from '../services/zone.service';
import { UpdateZoneInput } from '../inputs/update-zone.input';
import { Client } from '../../client/entities/client';
import { ClientRepository } from '../../client/repositories/client.repository';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { ClientAuthGuard } from '../../auth/guards/client-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ZoneQueryInput } from '../inputs/zone-query.input';
import { User } from '../../user/entities/user';
import { EventService } from '../../event/services/event.service';

const ZONE_ADDED_EVENT = 'zoneAdded';
const ZONE_UPDATED_EVENT = 'zoneUpdated';
const ZONE_DISABLED_EVENT = 'zoneDisabled';
const ZONE_RESTORED_EVENT = 'zoneRestored';

@Resolver(() => Zone)
export class ZoneResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private zoneRepo: ZoneRepository,
    private zoneService: ZoneService,
    private clientRepo: ClientRepository,
    private eventService: EventService,
  ) {}

  @Query(() => [Zone], { nullable: 'items' })
  @UseGuards(UserAuthGuard)
  async zones(
    @Args('input', { nullable: true }) input: ZonesInput,
    @Args('filter', { nullable: true }) filter: ZonesFilter,
  ): Promise<Zone[]> {
    let options = {};
    if (filter) options = Object.assign(options, { where: filter });
    if (input) options = Object.assign(options, input);
    return this.zoneRepo.find(options);
  }

  @Query(() => Zone, { nullable: true })
  @UseGuards(UserAuthGuard)
  async zone(
    @Args('id') id: number,
    @Args('input') input: ZoneQueryInput,
  ): Promise<Zone> {
    return this.zoneRepo.findOne({ where: { id }, ...input });
  }

  @Mutation(() => Zone)
  @UseGuards(UserAuthGuard)
  async createZone(
    @CurrentUser() user: User,
    @Args('input') input: CreateZoneInput,
  ): Promise<Zone> {
    const zoneAdded = await this.zoneService.create(input);
    await this.pubSub.publish(ZONE_ADDED_EVENT, { zoneAdded });

    await this.eventService.info({
      message: `${user.name} ${user.surname} создал${
        user.sex === 0 ? '' : 'а'
      } зону ${zoneAdded.name}`,
      entities: {
        userId: user.id,
        clientId: zoneAdded.clientId,
        zoneId: zoneAdded.id,
      },
      context: ZoneResolver.name,
    });

    return zoneAdded;
  }

  @Mutation(() => Zone)
  @UseGuards(UserAuthGuard)
  async updateZone(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('input') input: UpdateZoneInput,
  ): Promise<Zone> {
    const zoneUpdated = await this.zoneService.update(id, input);
    await this.pubSub.publish(ZONE_UPDATED_EVENT, { zoneUpdated });

    await this.eventService.info({
      message: `${user.name} ${user.surname} обновил${
        user.sex === 0 ? '' : 'а'
      } зону ${zoneUpdated.name}`,
      entities: {
        userId: user.id,
        clientId: zoneUpdated.clientId,
        zoneId: zoneUpdated.id,
      },
      context: ZoneResolver.name,
    });

    return zoneUpdated;
  }

  @Mutation(() => Zone)
  @UseGuards(UserAuthGuard)
  async disableZone(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<Zone> {
    const zoneDisabled = await this.zoneService.disable(id);
    await this.pubSub.publish(ZONE_DISABLED_EVENT, { zoneDisabled });
    await this.pubSub.publish(ZONE_UPDATED_EVENT, {
      zoneUpdated: zoneDisabled,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} отключил${
        user.sex === 0 ? '' : 'а'
      } зону ${zoneDisabled.name}`,
      entities: {
        userId: user.id,
        clientId: zoneDisabled.clientId,
        zoneId: zoneDisabled.id,
      },
      context: ZoneResolver.name,
    });

    return zoneDisabled;
  }

  @Mutation(() => Zone)
  @UseGuards(UserAuthGuard)
  async restoreZone(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<Zone> {
    const zoneRestored = await this.zoneService.restore(id);
    await this.pubSub.publish(ZONE_RESTORED_EVENT, { zoneRestored });
    await this.pubSub.publish(ZONE_UPDATED_EVENT, {
      zoneUpdated: zoneRestored,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} включил${
        user.sex === 0 ? '' : 'а'
      } зону ${zoneRestored.name}`,
      entities: {
        userId: user.id,
        clientId: zoneRestored.clientId,
        zoneId: zoneRestored.id,
      },
      context: ZoneResolver.name,
    });

    return zoneRestored;
  }

  @Subscription(() => Zone)
  @UseGuards(UserAuthGuard)
  zoneAdded() {
    return this.pubSub.asyncIterator(ZONE_ADDED_EVENT);
  }

  @Subscription(() => Zone)
  @UseGuards(UserAuthGuard)
  zoneUpdated() {
    return this.pubSub.asyncIterator(ZONE_UPDATED_EVENT);
  }

  @Subscription(() => Zone)
  @UseGuards(UserAuthGuard)
  zoneDisabled() {
    return this.pubSub.asyncIterator(ZONE_DISABLED_EVENT);
  }

  @Subscription(() => Zone)
  @UseGuards(UserAuthGuard)
  zoneRestored() {
    return this.pubSub.asyncIterator(ZONE_RESTORED_EVENT);
  }

  @ResolveField(() => Client)
  async client(@Parent() zone: Zone): Promise<Client> {
    return this.clientRepo.findOne(zone.clientId);
  }
}
