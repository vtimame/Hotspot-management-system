import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { GuestAuth } from '../entities/guest-auth';
import { Inject, NotFoundException, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GuestSessionRepository } from '../repositories/guest-session.repository';
import { GuestAuthRepository } from '../repositories/guest-auth.repository';
import { GuestDeviceRepository } from '../repositories/guest-device.repository';
import { RadiusCheckRepository } from '../../radius/repositories/radius-check.repository';
import { GuestSessionService } from '../services/guest-session.service';
import { EventService } from '../../event/services/event.service';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/entities/user';

@Resolver(() => GuestAuth)
export class GuestAuthResolver {
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
  @Mutation(() => String)
  async dropGuestAuth(
    @CurrentUser() user: User,
    @Args('id') sessionId: number,
  ): Promise<string> {
    const session = await this.guestSessionRepo.findOne({
      where: { id: sessionId },
      relations: ['device'],
    });
    if (!session) {
      throw new NotFoundException('Session not found');
    }

    await this.guestSessionService.dropSession(sessionId);
    await this.guestAuthRepo.softDelete(session.authId);

    await this.eventService.info({
      message: `${user.name} ${user.surname} завершил${
        user.sex === 0 ? '' : 'а'
      } авторизацию гостя ${session.device.mac}`,
      entities: {
        userId: user.id,
        guestDeviceId: session.deviceId,
        guestSessionId: session.id,
        guestAuthId: session.authId,
        zoneId: session.zoneId,
      },
      context: GuestAuthResolver.name,
    });

    return 'processed';
  }
}
