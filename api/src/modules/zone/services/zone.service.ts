import { Injectable } from '@nestjs/common';
import { ZoneRepository } from '../repositories/zone.repository';
import { CreateZoneInput } from '../inputs/create-zone.input';
import { Zone } from '../entities/zone';
import { UpdateZoneInput } from '../inputs/update-zone.input';
import { checkAffected } from '../../../common/utils';

@Injectable()
export class ZoneService {
  constructor(private zoneRepo: ZoneRepository) {}

  async create(dto: CreateZoneInput): Promise<Zone> {
    const newZoneEntity = this.zoneRepo.create(dto);
    return this.zoneRepo.save(newZoneEntity);
  }

  async update(id: number, dto: UpdateZoneInput): Promise<Zone> {
    const { affected } = await this.zoneRepo.update(id, dto);
    console.log(affected);
    await checkAffected(affected, 'Zone not found');
    return this.zoneRepo.findOne(id);
  }

  async disable(id: number): Promise<Zone> {
    const { affected } = await this.zoneRepo.softDelete(id);
    await checkAffected(affected, 'Zone not found');
    return this.zoneRepo.findOne({ where: { id }, withDeleted: true });
  }

  async restore(id: number): Promise<Zone> {
    const { affected } = await this.zoneRepo.restore(id);
    await checkAffected(affected, 'Zone not found');
    return this.zoneRepo.findOne(id);
  }
}
