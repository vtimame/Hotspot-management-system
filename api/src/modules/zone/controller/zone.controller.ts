import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Post,
} from '@nestjs/common';
import { Queue } from 'bull';
import { InjectQueue } from '@nestjs/bull';
import { ZoneRepository } from '../repositories/zone.repository';
import { AttemptBodyInput } from '../inputs/attempt-body.input';
import { UserAgent } from '../../../common/decorators/user-agent.decorator';
import { GuestDeviceService } from '../../guest/services/guest-device.service';
import { generateUserPassword } from '../../../common/utils';
import { CreateGuestAttemptInput } from '../../guest/inputs/create-guest-attempt.input';
import { GuestAttemptService } from '../../guest/services/guest-attempt.service';
import { VerifyAttemptBodyInput } from '../inputs/verify-attempt-body.input';
import { Zone } from '../entities/zone';
import { GuestDevice } from '../../guest/entities/guest-device';
import { GuestAttemptRepository } from '../../guest/repositories/guest-attempt.repository';
import { GuestAuthRepository } from '../../guest/repositories/guest-auth.repository';
import { GuestAuthService } from '../../guest/services/guest-auth.service';
import { GuestSessionRepository } from '../../guest/repositories/guest-session.repository';
import { GuestSessionService } from '../../guest/services/guest-session.service';
import { ZoneBodyInput } from '../inputs/zone-body.input';
import { GuestDeviceRepository } from '../../guest/repositories/guest-device.repository';
import { EventService } from '../../event/services/event.service';
import { Like } from 'typeorm';
import { GuestSessionTimeoutRepository } from '../../guest/repositories/guest-session-timeout.repository';
import { GuestSessionTimeoutService } from '../../guest/services/guest-session-timeout.service';
import { RadiusCheckService } from '../../radius/services/radius-check.service';
import * as dayjs from 'dayjs';
import { GuestAttempt } from '../../guest/entities/guest-attempt';

@Controller('zone')
export class ZoneController {
  constructor(
    @InjectQueue('sms') private smsQueue: Queue,
    @InjectQueue('sessions') private sessionsQueue: Queue,
    private zoneRepo: ZoneRepository,
    private guestDeviceService: GuestDeviceService,
    private guestDeviceRepo: GuestDeviceRepository,
    private guestAttemptService: GuestAttemptService,
    private guestAttemptRepo: GuestAttemptRepository,
    private guestAuthRepo: GuestAuthRepository,
    private guestAuthService: GuestAuthService,
    private guestSessionRepo: GuestSessionRepository,
    private guestSessionService: GuestSessionService,
    private eventService: EventService,
    private timeoutRepo: GuestSessionTimeoutRepository,
    private timeoutService: GuestSessionTimeoutService,
    private radiusCheckService: RadiusCheckService,
  ) {}

  @Post()
  async zone(@Body() body: ZoneBodyInput, @UserAgent() userAgent) {
    const zone = await this.zoneRepo.findGuestZone(body?.interfaceName);
    if (!zone) throw new NotFoundException();

    let device = await this.guestDeviceRepo.findByMac(body.mac);
    if (!device) {
      device = await this.guestDeviceService.create({
        mac: body.mac,
        userAgent,
      });
      await this.logOpenZoneEvent(zone, device);
      return this.prepareZone(zone);
    }

    await this.timeoutService.checkGuestTimeout(zone, device);
    const auth = await this.guestAuthService.checkAuthentication(zone, device);
    if (!auth) {
      await this.logOpenZoneEvent(zone, device);
      return this.prepareZone(zone);
    }

    return { redirectLink: zone.redirectLink };
  }

  private prepareZone(zone: Zone): Zone {
    const zoneData = Object.assign({}, zone);
    delete zoneData.routerIp;
    delete zoneData.routerLogin;
    delete zoneData.routerPassword;
    return zoneData;
  }

  private async logOpenZoneEvent(
    zone: Zone,
    device: GuestDevice,
  ): Promise<void> {
    await this.eventService.info({
      message: `Гость ${device.mac} открыл страницу авторизации`,
      entities: {
        clientId: zone.clientId,
        zoneId: zone.id,
        guestDeviceId: device.id,
      },
      context: ZoneController.name,
    });
  }

  // @Post()
  // async zone(@Body() body: ZoneBodyInput, @UserAgent() userAgent) {
  //   const device = await this.guestDeviceService.findOrCreate({
  //     mac: body.mac,
  //     userAgent,
  //   });
  //   const zone = await this.zoneRepo.findGuestZone(body?.interfaceName);
  //   if (!zone) throw new NotFoundException();
  //
  //   await this.eventService.info({
  //     message: `Гость ${device.mac} открыл страницу авторизации`,
  //     entities: {
  //       clientId: zone.clientId,
  //       zoneId: zone.id,
  //       guestDeviceId: device.id,
  //     },
  //     context: ZoneController.name,
  //   });
  //
  //   await this.timeoutService.checkGuestTimeout(zone, device);
  //   const auth = await this.guestAuthService.checkAuthentication(zone, device);
  //   if (!auth) return zone;
  //
  //   const credentials = await this.guestSessionService.getCredentials({
  //     auth,
  //     zone,
  //     device,
  //     ip: body.ip,
  //   });
  //
  //   await this.eventService.info({
  //     message: `Гость ${device.mac} авторизован. Выданный ip: ${body.ip}`,
  //     entities: {
  //       clientId: zone.clientId,
  //       zoneId: zone.id,
  //       guestDeviceId: device.id,
  //       guestSessionId: credentials.sessionId,
  //     },
  //     context: ZoneController.name,
  //   });
  //
  //   return { redirectLink: zone.redirectLink };
  // }

  private async getZoneAndDevice(
    body: VerifyAttemptBodyInput | AttemptBodyInput,
    ua: string,
  ): Promise<{ zone: Zone; device: GuestDevice }> {
    const zone = await this.zoneRepo.findOneOrFail(body.zoneId);
    const device = await this.guestDeviceService.findOrCreate({
      mac: body.mac,
      userAgent: ua,
    });

    return { zone, device };
  }

  @Post('attempt')
  async onAuthAttempt(@Body() body: AttemptBodyInput, @UserAgent() userAgent) {
    const password = generateUserPassword().toString();
    const { zone, device } = await this.getZoneAndDevice(body, userAgent);

    let logMessage = `Гость ${device.mac} не авторизован.  Попытка авторизации`;

    let attemptDto: CreateGuestAttemptInput = {
      zoneId: body.zoneId,
      deviceId: device.id,
      phoneNumber: body.phoneNumber,
      ip: body.ip,
      mac: body.mac,
    };

    if (zone.authTypes.includes('sms')) {
      logMessage = `${logMessage} по sms`;
      await this.smsQueue.add({
        phone: body.phoneNumber,
        message: `Ваш новый пин-код: ${password}`,
        eventEntities: { zoneId: zone.id, deviceId: device.id },
      });
      attemptDto = { ...attemptDto, password };
    } else {
      logMessage = `${logMessage} по звонку`;
    }

    await this.guestAttemptService.create(attemptDto);

    await this.eventService.info({
      message: logMessage,
      entities: {
        clientId: zone.clientId,
        zoneId: zone.id,
        guestDeviceId: device.id,
      },
      context: ZoneController.name,
    });

    return { status: 'attempt saved' };
  }

  @Post('attempt/verify')
  async onVerifyAttempt(
    @Body() body: VerifyAttemptBodyInput,
    @UserAgent() userAgent,
  ) {
    let attempt;
    const { zone, device } = await this.getZoneAndDevice(body, userAgent);
    if (zone.authTypes.includes('call') && !zone.authTypes.includes('sms')) {
      await this.guestAuthRepo.findOneOrFail({
        zoneId: zone.id,
        deviceId: device.id,
      });
    } else {
      attempt = await this.guestAttemptRepo.findVerifyAttempt(
        zone,
        body,
        device,
      );

      await this.guestAttemptService.verifyAttempt(attempt, body);
      await this.issueSession(zone, device, attempt);
    }

    return { redirectLink: zone.redirectLink };
  }

  private async issueSession(
    zone: Zone,
    device: GuestDevice,
    attempt: GuestAttempt,
  ) {
    const auth = await this.guestAuthService.authenticate({
      zone,
      device,
      login: attempt.phoneNumber,
      ip: attempt.ip,
    });

    const credentials = await this.radiusCheckService.saveRadiusCredentials(
      auth.id,
    );

    await this.radiusCheckService.saveExpiration(
      credentials,
      dayjs().add(zone.authLifetime, 'seconds'),
    );

    await this.guestSessionService.issueMikrotikSession(
      attempt.ip,
      zone,
      credentials,
    );

    await this.sessionsQueue.add('disable', auth, {
      delay: dayjs(auth.expiresAt).diff(dayjs()),
    });
  }

  // @Post('attempt/verify')
  // async onVerifyAttempt(
  //   @Body() body: VerifyAttemptBodyInput,
  //   @UserAgent() userAgent,
  // ) {
  //   const { zone, device } = await this.getZoneAndDevice(body, userAgent);
  //
  //   if (zone.authTypes.includes('call') && !zone.authTypes.includes('sms')) {
  //     await this.guestAuthRepo.findOneOrFail({
  //       zoneId: zone.id,
  //       deviceId: device.id,
  //     });
  //
  //     return { redirectLink: zone.redirectLink };
  //   } else {
  //     const attempt = await this.guestAttemptRepo.findVerifyAttempt(
  //       zone,
  //       body,
  //       device,
  //     );
  //
  //     await this.guestAttemptService.verifyAttempt(attempt, body);
  //     const credentials = await this.guestAuthService.authenticate({
  //       zone,
  //       device,
  //       ip: body.ip,
  //       login: attempt.phoneNumber,
  //     });
  //
  //     await this.guestSessionService.issueMikrotikSession(
  //       body.ip,
  //       zone,
  //       credentials,
  //     );
  //
  //     return { redirectLink: zone.redirectLink };
  //   }
  // }

  @Post('asterisk/verify')
  async verifyCallFromAsterisk(@Body() body: { phone: string }) {
    const attempt = await this.guestAttemptRepo.findOneOrFail({
      where: { phoneNumber: Like(`%${body.phone}%`) },
      relations: ['zone', 'device'],
    });

    await this.issueSession(attempt.zone, attempt.device, attempt);

    // const credentials = await this.guestAuthService.authenticate({
    //   zone: attempt.zone,
    //   device: attempt.device,
    //   ip: attempt.ip,
    //   login: attempt.phoneNumber,
    // });
    //
    // await this.guestSessionService.issueMikrotikSession(
    //   attempt.ip,
    //   attempt.zone,
    //   credentials,
    // );

    await this.guestAttemptRepo.softDelete(attempt.id);
    return { redirectLink: attempt.zone.redirectLink };
  }
}
