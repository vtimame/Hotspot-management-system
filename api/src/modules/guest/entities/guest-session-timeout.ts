import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'guest_session_timeouts' })
export class GuestSessionTimeout extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  zoneId: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  deviceId: number;

  @CreateDateColumn()
  startedAt: Date;

  @Column({ type: 'timestamp' })
  expiresAt: Date;
}
