import { BadRequestException, Injectable } from '@nestjs/common';
import { ClientEmployeeRepository } from '../repositories/client-employee.repository';
import { CreateClientInput } from '../inputs/create-client.input';
import { ClientEmployee } from '../entities/client-employee';
import { UpdateClientEmployeeInput } from '../inputs/update-client-employee.input';
import { checkAffected } from '../../../common/utils';
import { UserRepository } from '../../user/repositories/user.repository';
import { CreateClientEmployeeInput } from '../inputs/create-client-employee.input';

@Injectable()
export class ClientEmployeeService {
  constructor(
    private clientEmployeeRepo: ClientEmployeeRepository,
    private userRepo: UserRepository,
  ) {}

  async create(dto: CreateClientEmployeeInput): Promise<ClientEmployee> {
    const findUserByLogins = await this.userRepo.findByLogins([
      dto.phoneNumber,
      dto.email,
    ]);

    const findEmployeeByLogins = await this.clientEmployeeRepo.findByLogins([
      dto.phoneNumber,
      dto.email,
    ]);

    if (findEmployeeByLogins.length > 0 || findUserByLogins.length > 0) {
      throw new BadRequestException('Entity already exists');
    }

    return this.clientEmployeeRepo.save(this.clientEmployeeRepo.create(dto));
  }

  async update(
    id: number,
    dto: UpdateClientEmployeeInput,
  ): Promise<ClientEmployee> {
    const { affected } = await this.clientEmployeeRepo.update(id, { ...dto });
    await checkAffected(affected, 'ClientEmployee not found');
    return this.clientEmployeeRepo.findOne(id);
  }

  async disable(id: number): Promise<ClientEmployee> {
    const { affected } = await this.clientEmployeeRepo.softDelete(id);
    await checkAffected(affected, 'ClientEmployee not found');
    return this.clientEmployeeRepo.findOne({
      where: { id },
      withDeleted: true,
    });
  }

  async restore(id: number): Promise<ClientEmployee> {
    const { affected } = await this.clientEmployeeRepo.restore(id);
    await checkAffected(affected, 'ClientEmployee not found');
    return this.clientEmployeeRepo.findOne(id);
  }
}
