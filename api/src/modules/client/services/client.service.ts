import { BadRequestException, Injectable } from '@nestjs/common';
import { Client } from '../entities/client';
import { CreateClientInput } from '../inputs/create-client.input';
import { UpdateClientInput } from '../inputs/update-client.input';
import { checkAffected } from '../../../common/utils';
import { ClientRepository } from '../repositories/client.repository';
import { UserRepository } from '../../user/repositories/user.repository';

@Injectable()
export class ClientService {
  constructor(
    private clientRepo: ClientRepository,
    private userRepo: UserRepository,
  ) {}

  async create(dto: CreateClientInput): Promise<Client> {
    // const findUserByLogins = await this.userRepo.findByLogins([
    //   dto.phoneNumber,
    //   dto.email,
    // ]);
    //
    // const findClientByLogins = await this.clientRepo.findByLogins([
    //   dto.phoneNumber,
    //   dto.email,
    // ]);

    // if (findUserByLogins.length > 0 || findClientByLogins.length > 0) {
    //   throw new BadRequestException('Entity already exists');
    // }

    const client = await this.clientRepo.findOne({ name: dto.name });
    if (client) {
      throw new BadRequestException('Entity already exists');
    }

    const newClintEntity = this.clientRepo.create(dto);
    return this.clientRepo.save(newClintEntity);
  }

  async update(id: number, dto: UpdateClientInput): Promise<Client> {
    const { affected } = await this.clientRepo.update(id, dto);
    await checkAffected(affected, 'Client not found!');
    return this.clientRepo.findOne(id);
  }

  async disable(id: number): Promise<Client> {
    const { affected } = await this.clientRepo.softDelete(id);
    await checkAffected(affected, 'Client not found!');
    return this.clientRepo.findOne(id, { withDeleted: true });
  }

  async restore(id: number): Promise<Client> {
    const { affected } = await this.clientRepo.restore(id);
    await checkAffected(affected, 'Client not found');
    return this.clientRepo.findOne(id);
  }
}
