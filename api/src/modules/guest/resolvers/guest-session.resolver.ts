import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { GuestSessionRepository } from '../repositories/guest-session.repository';
import { GuestSession } from '../entities/guest-session';
import { GuestSessionsInput } from '../inputs/guest-sessions.input';
import { Between } from 'typeorm';
import { GuestAuthRepository } from '../repositories/guest-auth.repository';
import { GuestDeviceRepository } from '../repositories/guest-device.repository';
import { GuestAuth } from '../entities/guest-auth';
import { GuestDevice } from '../entities/guest-device';
import { RadiusCheck } from '../../radius/entities/radius-check';
import { RadiusCheckRepository } from '../../radius/repositories/radius-check.repository';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GuestSessionService } from '../services/guest-session.service';
import { EventService } from '../../event/services/event.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/entities/user';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';

export const GUEST_SESSION_ADDED_EVENT = 'guestSessionAdded';
export const GUEST_SESSION_DISABLED_EVENT = 'guestSessionDisabled';

@Resolver(() => GuestSession)
export class GuestSessionResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private guestSessionRepo: GuestSessionRepository,
    private guestAuthRepo: GuestAuthRepository,
    private guestDeviceRepo: GuestDeviceRepository,
    private radiusCheckRepo: RadiusCheckRepository,
    private guestSessionService: GuestSessionService,
    private eventService: EventService,
  ) {}

  @UseGuards(UserAuthGuard)
  @Query(() => [GuestSession], { nullable: 'items' })
  async guestSessions(
    @Args('filter') filter: GuestSessionsInput,
  ): Promise<GuestSession[]> {
    return this.guestSessionRepo.find({
      where: {
        zoneId: filter.zoneId,
        startedAt: Between(filter.issuedFrom, filter.issuedTo),
      },
      withDeleted: filter?.withDeleted || false,
    });
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => String)
  async dropGuestSession(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<string> {
    const session = await this.guestSessionRepo.findOne({
      where: { id },
      relations: ['device'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.guestSessionService.dropSession(id);

    await this.eventService.info({
      message: `${user.name} ${user.surname} завершил${
        user.sex === 0 ? '' : 'а'
      } сессию гостя ${session.device.mac}`,
      entities: {
        userId: user.id,
        guestDeviceId: session.deviceId,
        guestSessionId: session.id,
        guestAuthId: session.authId,
        zoneId: session.zoneId,
      },
      context: GuestSessionResolver.name,
    });

    return 'processed';
  }

  @UseGuards(UserAuthGuard)
  @ResolveField(() => GuestAuth, { nullable: true })
  async auth(@Parent() session: GuestSession): Promise<GuestAuth> {
    return this.guestAuthRepo.findOne(session.authId);
  }

  @UseGuards(UserAuthGuard)
  @ResolveField(() => GuestDevice)
  async device(@Parent() session: GuestSession): Promise<GuestDevice> {
    return this.guestDeviceRepo.findOne(session.deviceId);
  }

  @UseGuards(UserAuthGuard)
  @ResolveField(() => RadiusCheck, { nullable: true })
  async radiusCredentials(
    @Parent() session: GuestSession,
  ): Promise<RadiusCheck> {
    return this.radiusCheckRepo.findOne({
      where: { sessionId: session.id, attribute: 'Cleartext-Password' },
    });
  }

  @UseGuards(UserAuthGuard)
  @ResolveField(() => RadiusCheck, { nullable: true })
  async radiusExpiration(
    @Parent() session: GuestSession,
  ): Promise<RadiusCheck> {
    return this.radiusCheckRepo.findOne({
      where: { sessionId: session.id, attribute: 'Expiration' },
    });
  }

  @Subscription(() => GuestSession, {
    filter: (payload, variables) =>
      payload.guestSessionAdded.zoneId === variables.zoneId,
  })
  async guestSessionAdded(@Args('zoneId') zoneId: number) {
    return this.pubSub.asyncIterator(GUEST_SESSION_ADDED_EVENT);
  }

  @Subscription(() => GuestSession, {
    filter: (payload, variables) =>
      payload.guestSessionDisabled.zoneId === variables.zoneId,
  })
  async guestSessionDisabled(@Args('zoneId') zoneId: number) {
    return this.pubSub.asyncIterator(GUEST_SESSION_DISABLED_EVENT);
  }
}
