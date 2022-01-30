import { EntityRepository, Repository } from 'typeorm';
import { GuestAttempt } from '../entities/guest-attempt';
import { Zone } from '../../zone/entities/zone';
import { VerifyAttemptBodyInput } from '../../zone/inputs/verify-attempt-body.input';
import { GuestDevice } from '../entities/guest-device';

@EntityRepository(GuestAttempt)
export class GuestAttemptRepository extends Repository<GuestAttempt> {
  async findByZoneId(zoneId: number): Promise<GuestAttempt[]> {
    return this.find({ zoneId });
  }

  async findByDeviceId(deviceId: number): Promise<GuestAttempt[]> {
    return this.find({ deviceId });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<GuestAttempt> {
    return this.findOne({ phoneNumber });
  }

  async findVerifyAttempt(
    zone: Zone,
    params: VerifyAttemptBodyInput,
    device: GuestDevice,
  ): Promise<GuestAttempt> {
    return this.findOneOrFail({
      zoneId: params.zoneId,
      phoneNumber: params.phoneNumber,
      deviceId: device.id,
    });
  }
}
