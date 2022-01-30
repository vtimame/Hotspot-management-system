import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Client } from '../../client/entities/client';
import { AuthPage } from '../../auth-page/entities/auth-page';
import { GuestAttempt } from '../../guest/entities/guest-attempt';

@ObjectType()
@Entity({ name: 'zones' })
export class Zone {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column({ type: 'int', unsigned: true })
  clientId: number;

  @Field(() => Int, { nullable: true })
  @Index()
  @Column({ type: 'int', unsigned: true, nullable: true })
  authPageId?: number;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar' })
  name: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  interfaceName: string;

  @Field(() => String)
  @Column({ type: 'inet' })
  routerIp: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  routerLogin: string;

  @Field(() => String)
  @Column({ type: 'varchar' })
  routerPassword: string;

  @Field(() => [String], { nullable: 'items' })
  @Column({ type: 'varchar', array: true, default: [] })
  authTypes: string[];

  @Field(() => Int)
  @Column({ type: 'bigint', unsigned: true })
  authLifetime: number;

  @Field(() => Int)
  @Column({ type: 'bigint', unsigned: true })
  sessionLifetime: number;

  @Field(() => Int)
  @Column({ type: 'bigint', unsigned: true })
  sessionTimeout: number;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  redirectLink?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  disabledAt?: Date;

  @ManyToOne(() => Client, (e) => e.zones)
  client: Client;

  @OneToOne(() => AuthPage, { nullable: true })
  @JoinColumn()
  authPage: AuthPage;

  @OneToMany(() => GuestAttempt, (e) => e.zone)
  guestAttempts: GuestAttempt[];
}
