import { EntityRepository, Repository } from 'typeorm';
import { ClientPassword } from '../entities/client-password';

@EntityRepository(ClientPassword)
export class ClientPasswordRepository extends Repository<ClientPassword> {
  async findByClientId(clientId: number): Promise<ClientPassword> {
    return this.findOne({ clientId });
  }
}
