import * as dayjs from 'dayjs';
import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
} from '@nestjs/common';
import { GuestSessionRepository } from '../repositories/guest-session.repository';
import { CreateGuestSessionInput } from '../inputs/create-guest-session.input';
import { GuestSession } from '../entities/guest-session';
import { IssueSessionInput } from '../inputs/issue-session.input';
import { RadiusCheckService } from '../../radius/services/radius-check.service';
import { RadiusCheck } from '../../radius/entities/radius-check';
import { GuestAuth } from '../entities/guest-auth';
import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from '../entities/guest-device';
import { RadiusCheckRepository } from '../../radius/repositories/radius-check.repository';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import {
  GUEST_SESSION_ADDED_EVENT,
  GUEST_SESSION_DISABLED_EVENT,
} from '../resolvers/guest-session.resolver';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { RouterOSAPI } from 'node-routeros';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { EventService } from '../../event/services/event.service';
import { GuestSessionTimeoutRepository } from '../repositories/guest-session-timeout.repository';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class GuestSessionService {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    @InjectQueue('sessions') private sessionsQueue: Queue,
    private guestSessionRepo: GuestSessionRepository,
    private radiusCheckService: RadiusCheckService,
    private radiusCheckRepo: RadiusCheckRepository,
    private zoneRepo: ZoneRepository,
    private eventService: EventService,
    private timeoutRepo: GuestSessionTimeoutRepository,
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  async getCredentials(dto: {
    auth: GuestAuth;
    zone: Zone;
    device: GuestDevice;
    ip: string;
  }): Promise<RadiusCheck> {
    let credentials = await this.checkSession(dto.auth, dto.zone, dto.device);
    if (!credentials) credentials = await this.issueSession(dto);
    await this.issueMikrotikSession(dto.ip, dto.zone, credentials);
    return credentials;
  }

  async create(dto: CreateGuestSessionInput): Promise<GuestSession> {
    const newEntity = this.guestSessionRepo.create(dto);
    return this.guestSessionRepo.save(newEntity);
  }

  async issueSession(dto: IssueSessionInput): Promise<RadiusCheck> {
    const now = dayjs();
    const session = await this.create({
      zoneId: dto.zone.id,
      deviceId: dto.device.id,
      authId: dto.auth.id,
      ip: dto.ip,
      startedAt: now.toDate(),
      expiresAt: now.add(dto.zone.sessionLifetime, 'seconds').toDate(),
    });

    const credentials = await this.radiusCheckService.saveRadiusCredentials(
      session.id,
    );

    await this.radiusCheckService.saveExpiration(
      credentials,
      now.add(dto.zone.sessionLifetime, 'seconds'),
    );

    await this.sessionsQueue.add('disable', session, {
      delay: dayjs(session.expiresAt).diff(now) + 10000,
    });
    await this.pubSub.publish(GUEST_SESSION_ADDED_EVENT, {
      guestSessionAdded: session,
    });

    await this.eventService.info({
      message: `Гость ${dto.device.mac} авторизован, выданный ip: ${dto.ip}`,
      entities: {
        clientId: dto.zone.clientId,
        zoneId: dto.zone.id,
        guestDeviceId: dto.device.id,
        guestSessionId: session.id,
      },
      context: GuestSessionService.name,
    });

    return credentials;
  }

  async checkSession(
    auth: GuestAuth,
    zone: Zone,
    device: GuestDevice,
  ): Promise<RadiusCheck | null> {
    const now = dayjs();
    const session = await this.guestSessionRepo.findOne({
      authId: auth?.id,
      zoneId: zone?.id,
      deviceId: device?.id,
    });

    if (!session) return null;
    const credentials = await this.radiusCheckRepo.findOne({
      sessionId: session.id,
      attribute: 'Cleartext-Password',
    });

    if (dayjs(session.expiresAt).unix() > now.unix()) {
      return credentials;
    } else {
      if (
        now.unix() <
        dayjs(session.expiresAt).add(zone.sessionTimeout, 'seconds').unix()
      ) {
        throw new ForbiddenException({
          endOfTimeout:
            dayjs(session.expiresAt)
              .add(zone.sessionTimeout, 'seconds')
              .unix() - now.unix(),
        });
      }

      await this.guestSessionRepo.softDelete(session.id);
    }

    return null;
  }

  async dropSession(sessionId: number) {
    // const session = await this.guestSessionRepo.findOne(sessionId);
    // const radiusCredentials = await this.radiusCheckRepo.findBySessionId(
    //   sessionId,
    // );
    // const dropJobs = await this.sessionsQueue.getDelayed();
    // const dropJob = dropJobs.find((job) => job.data.id === sessionId);
    // if (dropJob) await dropJob.remove();
    //
    // const zone = await this.zoneRepo.findOne(session.zoneId);
    // if (!zone) {
    //   throw new BadRequestException('Zone not found');
    // }
    //
    // const { routerIp, routerLogin, routerPassword } = zone;
    // const conn = new RouterOSAPI({
    //   host: routerIp,
    //   user: routerLogin,
    //   password: routerPassword,
    // });
    //
    // conn.on('error', (error) => {
    //   this.sentry.instance().captureException(error);
    // });
    //
    // await conn.connect();
    //
    // conn.on('error', function (error) {
    //   console.log(error);
    // });
    //
    // if (conn.connected) {
    //   try {
    //     const active = await conn.write('/ip/hotspot/active/print');
    //     const hotspotSessionIndex = active.findIndex(
    //       (el) => el.user === radiusCredentials.username,
    //     );
    //
    //     if (hotspotSessionIndex !== -1) {
    //       await conn.write('/ip/hotspot/active/remove', [
    //         '=numbers=' + hotspotSessionIndex.toString(),
    //       ]);
    //
    //       console.log('Session dropped');
    //     }
    //     await conn.close();
    //     console.log('Connection closed');
    //   } catch (error) {
    //     this.sentry.instance().captureException(error);
    //     console.log(error);
    //   }
    // }
    //
    // if (zone.sessionTimeout > 0) {
    //   await this.timeoutRepo.save(
    //     this.timeoutRepo.create({
    //       zoneId: zone.id,
    //       deviceId: session.deviceId,
    //       expiresAt: dayjs().add(zone.sessionTimeout, 'seconds'),
    //     }),
    //   );
    // }
    //
    // await this.guestSessionRepo.softDelete(sessionId);
    // await this.pubSub.publish(GUEST_SESSION_DISABLED_EVENT, {
    //   guestSessionDisabled: session,
    // });
  }

  async issueMikrotikSession(ip: string, zone: Zone, credentials: RadiusCheck) {
    const { routerIp, routerLogin, routerPassword } = zone;
    const conn = new RouterOSAPI({
      host: routerIp,
      user: routerLogin,
      password: routerPassword,
    });

    await conn.connect();
    conn.on('error', (error) => {
      this.sentry.instance().captureException(error);
    });

    if (conn.connected) {
      try {
        await conn.write('/ip/hotspot/active/login', [
          '=ip=' + ip,
          '=user=' + credentials.username,
          '=password=' + credentials.value,
        ]);
        await conn.close();
      } catch (error) {
        this.sentry.instance().captureException(error);
        throw new BadRequestException('');
      }
    }
  }
}
