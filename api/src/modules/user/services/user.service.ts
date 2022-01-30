import { BadRequestException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserInput } from '../inputs/create-user.input';
import { User } from '../entities/user';
import { checkAffected, parsePhoneNumber } from '../../../common/utils';
import { UpdateUserInput } from '../inputs/update-user.input';
import { ClientRepository } from '../../client/repositories/client.repository';
import { ClientEmployeeRepository } from '../../client/repositories/client-employee.repository';

@Injectable()
export class UserService {
  constructor(
    private userRepo: UserRepository,
    private clientEmployeeRepo: ClientEmployeeRepository,
  ) {}

  async create(dto: CreateUserInput): Promise<User> {
    const findUserByLogins = await this.userRepo.findByLogins([
      dto.phoneNumber,
      dto.email,
      dto.alias,
    ]);

    const findClientByLogins = await this.clientEmployeeRepo.findByLogins([
      dto.phoneNumber,
      dto.email,
    ]);

    if (findUserByLogins.length > 0 || findClientByLogins.length > 0) {
      throw new BadRequestException('Entity already exists');
    }

    const newUser = this.userRepo.create(
      Object.assign({}, dto, {
        phoneNumber: parsePhoneNumber(dto.phoneNumber),
      }),
    );
    return this.userRepo.save(newUser);
  }

  async update(id: number, dto: UpdateUserInput): Promise<User> {
    const { affected } = await this.userRepo.update(id, dto);
    await checkAffected(affected, 'User not found!');
    return this.userRepo.findOne(id);
  }

  async disable(id: number): Promise<User> {
    const { affected } = await this.userRepo.softDelete(id);
    await checkAffected(affected, 'User not found!');
    return this.userRepo.findOne(id, { withDeleted: true });
  }

  async restore(id: number): Promise<User> {
    const { affected } = await this.userRepo.restore(id);
    await checkAffected(affected, 'User not found!');
    return this.userRepo.findOne(id);
  }
}
