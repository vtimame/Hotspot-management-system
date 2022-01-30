import { EntityRepository, Repository } from 'typeorm';
import { GuestSession } from '../entities/guest-session';

@EntityRepository(GuestSession)
export class GuestSessionRepository extends Repository<GuestSession> {
  async findByZoneId(zoneId: number): Promise<GuestSession[]> {
    return this.find({ zoneId });
  }

  async findByDeviceId(deviceId: number): Promise<GuestSession[]> {
    return this.find({ deviceId });
  }

  async findByAuthId(authId: number): Promise<GuestSession[]> {
    return this.find({ authId });
  }
}
