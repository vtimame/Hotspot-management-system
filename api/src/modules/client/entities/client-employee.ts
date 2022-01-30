import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client';

@ObjectType()
@Entity({ name: 'client_employee' })
export class ClientEmployee extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Column({ type: 'int', unsigned: true })
  clientId: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  surname: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  patronymic: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 50, unique: true })
  email: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  disabledAt?: Date;

  @ManyToOne(() => Client, (e) => e.employees)
  client: Client;
}
