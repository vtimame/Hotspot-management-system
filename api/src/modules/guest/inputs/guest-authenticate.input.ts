import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from '../entities/guest-device';

export class GuestAuthenticateInput {
  zone: Zone;
  device: GuestDevice;
  ip: string;
  login: string;
}
