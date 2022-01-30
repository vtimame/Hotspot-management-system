import { Injectable } from '@nestjs/common';
import { GuestDeviceRepository } from '../repositories/guest-device.repository';
import { CreateGuestDeviceInput } from '../inputs/create-guest-device.input';
import { GuestDevice } from '../entities/guest-device';

@Injectable()
export class GuestDeviceService {
  constructor(private guestDeviceRepo: GuestDeviceRepository) {}

  async findOrCreate(dto: CreateGuestDeviceInput): Promise<GuestDevice> {
    const device = await this.guestDeviceRepo.findByMac(dto.mac);
    const newInstance = this.guestDeviceRepo.create(dto);

    return device ? device : this.guestDeviceRepo.save(newInstance);
  }

  async create(dto: CreateGuestDeviceInput): Promise<GuestDevice> {
    return this.guestDeviceRepo.save(this.guestDeviceRepo.create(dto));
  }
}
