import { EntityRepository, Repository } from 'typeorm';
import { AuthPage } from '../entities/auth-page';
import { AuthPageFilter, AuthPagesInput } from '../inputs/auth-pages.input';

@EntityRepository(AuthPage)
export class AuthPageRepository extends Repository<AuthPage> {
  async findAll(
    filter: AuthPageFilter,
    input?: AuthPagesInput,
  ): Promise<AuthPage[]> {
    return this.find(input ? { where: filter, ...input } : { where: filter });
  }
}
