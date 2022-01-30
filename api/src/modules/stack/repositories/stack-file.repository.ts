import { EntityRepository, Repository } from 'typeorm';
import { StackFile } from '../entities/stack-file';

@EntityRepository(StackFile)
export class StackFileRepository extends Repository<StackFile> {
  async findByName(name: string): Promise<StackFile> {
    return this.findOne({ where: { name } });
  }

  async findByFolder(folder: string): Promise<StackFile[]> {
    return this.find({ where: { folder } });
  }
}
