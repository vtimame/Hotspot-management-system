import { Injectable } from '@nestjs/common';
import { RadiusCheckRepository } from '../repositories/radius-check.repository';
import { CreateRadiusCheckInput } from '../inputs/create-radius-check.input';
import { RadiusCheck } from '../entities/radius-check';
import { GuestSession } from '../../guest/entities/guest-session';
import { nanoid } from 'nanoid';
import { Dayjs } from 'dayjs';

@Injectable()
export class RadiusCheckService {
  constructor(private radiusCheckRepo: RadiusCheckRepository) {}

  async create(dto: CreateRadiusCheckInput): Promise<RadiusCheck> {
    const newEntity = this.radiusCheckRepo.create(dto);
    return this.radiusCheckRepo.save(newEntity);
  }

  async deleteBySessionId(sessionId: number) {
    return this.radiusCheckRepo.delete({ sessionId });
  }

  async saveRadiusCredentials(sessionId: number): Promise<RadiusCheck> {
    return this.create({
      sessionId,
      username: nanoid(32),
      attribute: 'Cleartext-Password',
      op: ':=',
      value: nanoid(34),
    });
  }

  async saveExpiration(
    credentials: RadiusCheck,
    expiresAt: Dayjs,
  ): Promise<CreateRadiusCheckInput> {
    return this.create({
      sessionId: credentials.sessionId,
      username: credentials.username,
      attribute: 'Expiration',
      op: ':=',
      value: expiresAt.format('D MMM YYYY HH:mm:ss'),
    });
  }
}
