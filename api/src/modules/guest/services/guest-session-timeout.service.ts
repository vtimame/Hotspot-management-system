import { ForbiddenException, Injectable } from '@nestjs/common';
import { GuestSessionTimeoutRepository } from '../repositories/guest-session-timeout.repository';
import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from '../entities/guest-device';
import * as dayjs from 'dayjs';

@Injectable()
export class GuestSessionTimeoutService {
  constructor(private timeoutRepo: GuestSessionTimeoutRepository) {}

  async checkGuestTimeout(zone: Zone, device: GuestDevice): Promise<void> {
    const now = dayjs();
    const t = await this.timeoutRepo.findOne({
      zoneId: zone.id,
      deviceId: device.id,
    });
    if (t) {
      if (now.unix() < dayjs(t.expiresAt).unix()) {
        throw new ForbiddenException({ ...t, zone });
      } else {
        await this.timeoutRepo.delete(t.id);
      }
    }
  }
}
