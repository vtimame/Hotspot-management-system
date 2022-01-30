import { Injectable } from '@nestjs/common';
import { UserTokenRepository } from '../repositories/user-token.repository';
import { UserToken } from '../entities/user-token';

@Injectable()
export class UserTokenService {
  constructor(private userTokenRepo: UserTokenRepository) {}

  async create(dto: any): Promise<UserToken[]> {
    const newUserTokenEntity = this.userTokenRepo.create(dto);
    return this.userTokenRepo.save(newUserTokenEntity);
  }
}
