import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GuestAuth } from './guest-auth';
import { GuestDevice } from './guest-device';

@ObjectType()
@Entity({ name: 'guest_sessions' })
export class GuestSession extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column({ type: 'int', unsigned: true })
  zoneId: number;

  @Field(() => Int)
  @Index()
  @Column({ type: 'int', unsigned: true })
  deviceId: number;

  @Field(() => Int)
  @Index()
  @Column({ type: 'int', unsigned: true })
  authId: number;

  @Field(() => String)
  @Index()
  @Column({ type: 'inet' })
  ip: string;

  @Field()
  @Column({ type: 'timestamp' })
  startedAt: Date;

  @Field()
  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Field(() => Date, { nullable: true })
  @DeleteDateColumn()
  expiredAt?: Date;

  @ManyToOne(() => GuestAuth, (e) => e.sessions)
  auth: GuestAuth;

  @ManyToOne(() => GuestDevice, (e) => e.sessions)
  device: GuestDevice;
}
