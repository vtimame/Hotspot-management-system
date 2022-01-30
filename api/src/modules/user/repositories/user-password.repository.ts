import { EntityRepository, Repository } from 'typeorm';
import { UserPassword } from '../entities/user-password';

@EntityRepository(UserPassword)
export class UserPasswordRepository extends Repository<UserPassword> {
  async findByUserId(userId: number): Promise<UserPassword> {
    return this.findOneOrFail({ userId });
  }
}
