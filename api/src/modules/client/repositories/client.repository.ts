import { EntityRepository, In, Repository } from 'typeorm';
import { Client } from '../entities/client';
import { ClientsInput } from '../inputs/clients.input';
import { parsePhoneNumber } from '../../../common/utils';

@EntityRepository(Client)
export class ClientRepository extends Repository<Client> {
  async findAll(options?: ClientsInput): Promise<Client[]> {
    return this.find(options);
  }

  async findByName(name: string): Promise<Client> {
    return this.findOneOrFail({ name });
  }

  // async findByEmail(email: string): Promise<Client> {
  //   return this.findOneOrFail({ email });
  // }
  //
  // async findByPhoneNumber(phoneNumber: string): Promise<Client> {
  //   return this.findOneOrFail({ phoneNumber });
  // }

  async findByLogins(logins: string[]): Promise<Client[]> {
    return this.find({
      where: [{ email: In(logins) }, { phoneNumber: In(logins) }],
    });
  }

  async findByLogin(login: string): Promise<Client> {
    const reg = new RegExp(/^\d+$/);
    return this.findOne({
      where: reg.test(login)
        ? [{ phoneNumber: parsePhoneNumber(login) }]
        : [{ email: login }],
    });
  }
}
