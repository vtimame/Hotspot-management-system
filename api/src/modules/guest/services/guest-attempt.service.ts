import { Injectable, UnauthorizedException } from '@nestjs/common';
import { GuestAttemptRepository } from '../repositories/guest-attempt.repository';
import { CreateGuestAttemptInput } from '../inputs/create-guest-attempt.input';
import { GuestAttempt } from '../entities/guest-attempt';
import { VerifyAttemptBodyInput } from '../../zone/inputs/verify-attempt-body.input';
import { ZoneRepository } from '../../zone/repositories/zone.repository';

@Injectable()
export class GuestAttemptService {
  constructor(
    private guestAttemptRepo: GuestAttemptRepository,
    private zoneRepo: ZoneRepository,
  ) {}

  async create(dto: CreateGuestAttemptInput): Promise<GuestAttempt> {
    const previousAttempt = await this.guestAttemptRepo.findByPhoneNumber(
      dto.phoneNumber,
    );

    if (previousAttempt) {
      await this.delete(previousAttempt.id);
    }

    const newEntity = this.guestAttemptRepo.create(dto);
    return this.guestAttemptRepo.save(newEntity);
  }

  async delete(id: number) {
    return this.guestAttemptRepo.softDelete(id);
  }

  async verifyAttempt(
    attempt: GuestAttempt,
    params: VerifyAttemptBodyInput,
  ): Promise<void> {
    let verified = false;
    const zone = await this.zoneRepo.findOneOrFail(attempt.zoneId);
    if (zone.authTypes.includes('call')) {
      verified = attempt.verified;
    } else if (zone.authTypes.includes('sms')) {
      verified = attempt.password === params?.password;
    }

    if (verified) {
      await this.guestAttemptRepo.softDelete(attempt.id);
    } else {
      throw new UnauthorizedException('Attempt is not verified');
    }
  }
}
