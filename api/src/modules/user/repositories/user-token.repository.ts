import { EntityRepository, Repository } from 'typeorm';
import { UserToken } from '../entities/user-token';

@EntityRepository(UserToken)
export class UserTokenRepository extends Repository<UserToken> {
  async findByUserId(userId: number): Promise<UserToken[]> {
    return this.find({ userId });
  }
}
