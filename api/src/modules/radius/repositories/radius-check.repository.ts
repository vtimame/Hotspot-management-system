import { EntityRepository, Repository } from 'typeorm';
import { RadiusCheck } from '../entities/radius-check';

@EntityRepository(RadiusCheck)
export class RadiusCheckRepository extends Repository<RadiusCheck> {
  async findBySessionId(sessionId: number): Promise<RadiusCheck> {
    return this.findOne({ sessionId });
  }

  async findByUsername(username: string): Promise<RadiusCheck[]> {
    return this.find({ username });
  }
}
