import { EntityRepository, Repository } from 'typeorm';
import { GuestSessionTimeout } from '../entities/guest-session-timeout';

@EntityRepository(GuestSessionTimeout)
export class GuestSessionTimeoutRepository extends Repository<GuestSessionTimeout> {
  //
}
