import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from '../entities/guest-device';
import { GuestAuth } from '../entities/guest-auth';

export class IssueSessionInput {
  zone: Zone;
  device: GuestDevice;
  ip: string;
  auth: GuestAuth;
}
