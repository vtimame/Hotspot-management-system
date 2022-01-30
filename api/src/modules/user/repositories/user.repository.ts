import { EntityRepository, In, Repository } from 'typeorm';
import { User } from '../entities/user';
import { UsersInput } from '../inputs/users.input';
import { isEmail, parsePhoneNumber } from '../../../common/utils';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findAll(options?: UsersInput): Promise<User[]> {
    return this.find(options);
  }

  async findByAlias(alias: string): Promise<User> {
    return this.findOneOrFail({ alias });
  }

  async findByEmail(email: string): Promise<User> {
    return this.findOneOrFail({ email });
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    return this.findOneOrFail({ phoneNumber });
  }

  async findByLogins(logins: string[]): Promise<User[]> {
    return this.find({
      where: [
        { email: In(logins) },
        { alias: In(logins) },
        { phoneNumber: In(logins) },
      ],
    });
  }

  async findByLogin(login: string): Promise<User> {
    let conditions;
    if (parsePhoneNumber(login, false).length > 0) {
      conditions = { phoneNumber: parsePhoneNumber(login) };
    } else if (isEmail(login)) {
      conditions = { email: login };
    } else {
      conditions = { alias: login };
    }

    return this.findOne(conditions);
  }
}
