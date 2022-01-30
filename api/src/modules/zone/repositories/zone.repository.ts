import { EntityRepository, Repository } from 'typeorm';
import { Zone } from '../entities/zone';
import { ZonesInput } from '../inputs/zones.input';

@EntityRepository(Zone)
export class ZoneRepository extends Repository<Zone> {
  async findAll(options?: ZonesInput): Promise<Zone[]> {
    return this.find(options);
  }

  async findByClientId(
    clientId: number,
    options?: ZonesInput,
  ): Promise<Zone[]> {
    return this.find({
      where: { clientId },
      ...options,
      relations: ['authPage'],
    });
  }

  async findByName(name: string): Promise<Zone> {
    return this.findOneOrFail({ name });
  }

  async findGuestZone(interfaceName: string): Promise<Zone> {
    return this.findOne({
      where: { interfaceName },
      relations: ['authPage'],
    });
  }
}
