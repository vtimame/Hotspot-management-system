import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Zone } from '../../zone/entities/zone';
import { GuestDevice } from './guest-device';

@Entity({ name: 'guest_attempts' })
export class GuestAttempt extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  zoneId: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  deviceId: number;

  @Index()
  @Column({ type: 'varchar', length: 15 })
  phoneNumber: string;

  @Column({ type: 'inet' })
  ip: string;

  @Column({ type: 'macaddr' })
  mac: string;

  @Column({ type: 'varchar', length: 6, nullable: true })
  password: string;

  @Column({ type: 'bool', default: false })
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => Zone, (e) => e.guestAttempts)
  zone: Zone;

  @ManyToOne(() => GuestDevice, (e) => e.authAttempts)
  device: GuestDevice;
}
