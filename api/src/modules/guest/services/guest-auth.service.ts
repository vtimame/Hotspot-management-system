import * as dayjs from 'dayjs';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { GuestAuthRepository } from '../repositories/guest-auth.repository';
import { CreateGuestAuthInput } from '../inputs/create-guest-auth.input';
import { GuestAuth } from '../entities/guest-auth';
import { GuestAuthenticateInput } from '../inputs/guest-authenticate.input';
import { GuestSessionService } from './guest-session.service';
import { RadiusCheck } from '../../radius/entities/radius-check';
import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from '../entities/guest-device';
import { GuestDeviceService } from './guest-device.service';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { GuestDeviceRepository } from '../repositories/guest-device.repository';
import { RadiusCheckRepository } from '../../radius/repositories/radius-check.repository';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { RouterOSAPI } from 'node-routeros';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';
import { GuestSessionTimeoutRepository } from '../repositories/guest-session-timeout.repository';

@Injectable()
export class GuestAuthService {
  constructor(
    @InjectQueue('sessions') private sessionsQueue: Queue,
    @InjectSentry() private readonly sentry: SentryService,
    private guestAuthRepo: GuestAuthRepository,
    private guestSessionService: GuestSessionService,
    private guestDeviceRepo: GuestDeviceRepository,
    private radiusCheckRepo: RadiusCheckRepository,
    private zoneRepo: ZoneRepository,
    private timeoutRepo: GuestSessionTimeoutRepository,
  ) {}

  async create(dto: CreateGuestAuthInput): Promise<GuestAuth> {
    const newEntity = this.guestAuthRepo.create(dto);
    return this.guestAuthRepo.save(newEntity);
  }

  async authenticate(dto: GuestAuthenticateInput): Promise<GuestAuth> {
    const now = dayjs();
    return this.create({
      zoneId: dto.zone.id,
      deviceId: dto.device.id,
      login: dto.login,
      ip: dto.ip,
      startedAt: now.toDate(),
      expiresAt: now.add(dto.zone.authLifetime, 'seconds').toDate(),
    });

    // return this.guestSessionService.issueSession({
    //   ...dto,
    //   auth,
    // });
  }

  async checkAuthentication(
    zone: Zone,
    device: GuestDevice,
  ): Promise<GuestAuth | null> {
    const now = dayjs();
    const auth = await this.guestAuthRepo.findOne({
      zoneId: zone.id,
      deviceId: device.id,
    });

    if (!auth) return null;
    if (now.unix() > dayjs(auth.expiresAt).unix()) {
      await this.guestAuthRepo.softDelete(auth.id);
      return null;
    }

    return auth;
  }

  async dropAuth(id: number): Promise<void> {
    const auth = await this.guestAuthRepo.findOne(id);
    const device = await this.guestDeviceRepo.findOne(auth?.deviceId);
    const radius = await this.radiusCheckRepo.findBySessionId(auth?.id);
    if (!auth || !device || !radius) throw new NotFoundException();

    const dropJobs = await this.sessionsQueue.getDelayed();
    const dropJob = dropJobs.find((job) => job.data.id === auth.id);
    if (dropJob) await dropJob.remove();

    const zone = await this.zoneRepo.findOne(auth.zoneId);
    if (!zone) throw new BadRequestException();

    const { routerIp, routerLogin, routerPassword } = zone;
    const conn = new RouterOSAPI({
      host: routerIp,
      user: routerLogin,
      password: routerPassword,
    });

    conn.on('error', (error) => {
      this.sentry.instance().captureException(error);
    });

    await conn.connect();

    if (conn.connected) {
      await this.deleteFromActive(conn, radius.username);
      await this.dropFromWifi(conn, device.mac);
      await conn.close();
      console.log('Connection closed');
    }

    /* TEST */
    setTimeout(async () => {
      const conn = new RouterOSAPI({
        host: routerIp,
        user: routerLogin,
        password: routerPassword,
      });

      conn.on('error', (error) => {
        this.sentry.instance().captureException(error);
      });

      await conn.connect();

      if (conn.connected) {
        await this.dropFromWifi(conn, device.mac);
      }

      await conn.close();
      console.log('Connection closed');
    }, 1000);
    /* TEST */

    if (zone.sessionTimeout > 0) {
      await this.timeoutRepo.save(
        this.timeoutRepo.create({
          zoneId: zone.id,
          deviceId: device.id,
          expiresAt: dayjs().add(zone.sessionTimeout, 'seconds'),
        }),
      );
    }

    await this.guestAuthRepo.softDelete(id);
    // pub sub
  }

  private async dropFromWifi(conn: RouterOSAPI, mac: string): Promise<void> {
    try {
      const list = await conn.write(
        '/interface/wireless/registration-table/print',
      );
      const deviceIndex = list.findIndex(
        (el) => el['mac-address'] === mac.toUpperCase(),
      );

      list.forEach((el) => {
        console.log(Object.keys(el));
        console.log(mac);
      });

      if (deviceIndex !== -1) {
        console.log('DEVICE INDEX:', deviceIndex);
        await conn.write('/interface/wireless/registration-table/remove', [
          '=numbers=' + deviceIndex.toString(),
        ]);
        console.log('Device removed from wireless list');
      }
    } catch (error) {
      this.sentry.instance().captureException(error);
      console.log(error);
    }
  }

  private async deleteFromActive(
    conn: RouterOSAPI,
    user: string,
  ): Promise<void> {
    try {
      const active = await conn.write('/ip/hotspot/active/print');
      const hotspotSessionIndex = active.findIndex((el) => el.user === user);

      if (hotspotSessionIndex !== -1) {
        await conn.write('/ip/hotspot/active/remove', [
          '=numbers=' + hotspotSessionIndex.toString(),
        ]);

        console.log('Session dropped');
      }
    } catch (error) {
      this.sentry.instance().captureException(error);
      console.log(error);
    }
  }
}
