import {
  Args,
  Field,
  InputType,
  Int,
  Mutation,
  Resolver,
} from '@nestjs/graphql';
import { GuestSession } from '../guest/entities/guest-session';
import { GuestSessionRepository } from '../guest/repositories/guest-session.repository';
import { date, internet } from 'faker';
import { ConfigService } from '@nestjs/config';
import { ForbiddenException } from '@nestjs/common';
import { ZoneRepository } from '../zone/repositories/zone.repository';
import * as dayjs from 'dayjs';
import { GuestAuthRepository } from '../guest/repositories/guest-auth.repository';
import { GuestDeviceRepository } from '../guest/repositories/guest-device.repository';

@InputType()
export class GenerateTestExpiredSessionsInput {
  @Field(() => Int)
  zoneId: number;

  @Field(() => Int)
  sessionsCount: number;
}

@Resolver(() => GuestSession)
export class DevelopmentResolver {
  constructor(
    private configService: ConfigService,
    private guestSessionRepo: GuestSessionRepository,
    private guestAuthRepo: GuestAuthRepository,
    private guestDeviceRepo: GuestDeviceRepository,
    private zoneRepo: ZoneRepository,
  ) {}

  @Mutation(() => [GuestSession])
  async generateTestExpiredSessions(
    @Args('input') input: GenerateTestExpiredSessionsInput,
  ): Promise<GuestSession[]> {
    if (this.configService.get<string>('app.environment') !== 'development') {
      throw new ForbiddenException();
    }

    const zone = await this.zoneRepo.findOne(input.zoneId);

    const sessions = [];
    for (let i = 0; i < input.sessionsCount; i++) {
      const startedAt = date.past();
      const expiresAt = dayjs(startedAt).add(zone.sessionLifetime, 'seconds');
      sessions.push(
        this.guestSessionRepo.create({
          zoneId: input.zoneId,
          deviceId: 1,
          authId: 1,
          ip: internet.ip(),
          startedAt,
          expiresAt,
          expiredAt: expiresAt,
        }),
      );
    }

    return this.guestSessionRepo.save(sessions);
  }
}
