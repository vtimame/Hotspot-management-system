import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { GuestAttempt } from './guest-attempt';
import { GuestSession } from './guest-session';
import { GuestAuth } from './guest-auth';

@ObjectType()
@Entity({ name: 'guest_devices' })
export class GuestDevice extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Index()
  @Column({ type: 'macaddr', unique: true })
  mac: string;

  @Field(() => String)
  @Column({ type: 'text' })
  userAgent: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => GuestSession, (e) => e.device)
  sessions: GuestSession[];

  @OneToMany(() => GuestAttempt, (e) => e.device)
  authAttempts: GuestAttempt[];
}
