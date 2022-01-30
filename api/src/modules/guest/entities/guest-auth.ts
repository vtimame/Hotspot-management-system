import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { GuestSession } from './guest-session';
import { GuestDevice } from './guest-device';

@ObjectType()
@Entity({ name: 'guest_auth' })
export class GuestAuth extends BaseEntity {
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

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 30 })
  login: string;

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

  @OneToMany(() => GuestSession, (e) => e.auth)
  sessions: GuestSession[];
}
