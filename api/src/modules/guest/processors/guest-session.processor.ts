import { Process, Processor } from '@nestjs/bull';
import { Job } from 'bull';
import { GuestSessionRepository } from '../repositories/guest-session.repository';
import { Inject } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { GUEST_SESSION_DISABLED_EVENT } from '../resolvers/guest-session.resolver';
import { GuestSessionService } from '../services/guest-session.service';
import { GuestAuthRepository } from '../repositories/guest-auth.repository';
import { GuestDeviceRepository } from '../repositories/guest-device.repository';
import { GuestAuthService } from '../services/guest-auth.service';

@Processor('sessions')
export class GuestSessionProcessor {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private authRepo: GuestAuthRepository,
    private deviceRepo: GuestDeviceRepository,
    private guestAuthService: GuestAuthService,
  ) {}

  @Process('disable')
  async disableSession(job: Job<any>) {
    await this.guestAuthService.dropAuth(job.data.id);
    // await this.guestSessionService.dropSession(job.data.id);
    // const session = await this.sessionRepo.findOne(job.data.id, {
    //   withDeleted: true,
    // });
    // await this.sessionRepo.softDelete(job.data.id);
    // await this.pubSub.publish(GUEST_SESSION_DISABLED_EVENT, {
    //   guestSessionDisabled: session,
    // });
  }
}
