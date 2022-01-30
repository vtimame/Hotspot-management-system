import { EntityRepository, Repository } from 'typeorm';
import { GuestAuth } from '../entities/guest-auth';

@EntityRepository(GuestAuth)
export class GuestAuthRepository extends Repository<GuestAuth> {
  async findByZoneId(zoneId: number): Promise<GuestAuth[]> {
    return this.find({ zoneId });
  }

  async findByDeviceId(deviceId: number): Promise<GuestAuth[]> {
    return this.find({ deviceId });
  }
}
