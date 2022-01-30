import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Zone } from '../../zone/entities/zone';
import { AuthPage } from '../../auth-page/entities/auth-page';
import { ClientEmployee } from './client-employee';

@ObjectType()
@Entity({ name: 'clients' })
export class Client {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  name: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  disabledAt?: Date;

  @OneToMany(() => Zone, (e) => e.client)
  zones: Zone[];

  @OneToMany(() => AuthPage, (e) => e.client)
  authPages: AuthPage[];

  @OneToMany(() => ClientEmployee, (e) => e.client)
  employees: ClientEmployee[];
}
