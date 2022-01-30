import { EntityRepository, Repository } from 'typeorm';
import { GuestDevice } from '../entities/guest-device';

@EntityRepository(GuestDevice)
export class GuestDeviceRepository extends Repository<GuestDevice> {
  async findByMac(mac: string): Promise<GuestDevice> {
    return this.findOne({ mac });
  }
}
