import { EntityRepository, In, Repository } from 'typeorm';
import { ClientEmployee } from '../entities/client-employee';
import { ClientEmployeesInput } from '../inputs/client-employees.input';
import { parsePhoneNumber } from '../../../common/utils';

@EntityRepository(ClientEmployee)
export class ClientEmployeeRepository extends Repository<ClientEmployee> {
  async findByByClientId(
    input: ClientEmployeesInput,
  ): Promise<ClientEmployee[]> {
    return this.find({
      where: { clientId: input.clientId },
      withDeleted: input.withDeleted || false,
    });
  }

  async findByLogins(logins: string[]): Promise<ClientEmployee[]> {
    return this.find({
      where: [{ email: In(logins) }, { phoneNumber: In(logins) }],
    });
  }

  async findByLogin(login: string): Promise<ClientEmployee> {
    const reg = new RegExp(/^\d+$/);
    return this.findOne({
      where: reg.test(login)
        ? [{ phoneNumber: parsePhoneNumber(login) }]
        : [{ email: login }],
    });
  }
}
