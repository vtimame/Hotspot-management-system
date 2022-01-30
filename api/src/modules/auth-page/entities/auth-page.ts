import {
  BaseEntity,
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Client } from '../../client/entities/client';
import { Zone } from '../../zone/entities/zone';

@ObjectType()
@Entity({ name: 'auth_pages' })
export class AuthPage extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Int)
  @Index()
  @Column({ type: 'int', unsigned: true })
  clientId: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 120 })
  title: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 7, nullable: true })
  textColor?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 7, nullable: true })
  buttonColor?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 7, nullable: true })
  buttonTextColor?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 7, nullable: true })
  backgroundColor?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'enum', default: 'top', enum: ['top', 'bottom', 'center', 'left', 'right'] })
  backgroundPosition?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', length: 7, nullable: true })
  termsColor?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  logoImage?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  backgroundImage?: string;

  @Field(() => String, { nullable: true })
  @Column({ type: 'varchar', nullable: true })
  bannerImage?: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ['cover', 'contain', 'auto'],
    default: 'auto',
  })
  backgroundSize: string;

  @Field(() => String)
  @Column({
    type: 'enum',
    enum: ['no-repeat', 'repeat', 'repeat-x', 'repeat-y'],
    default: 'no-repeat',
  })
  backgroundRepeat: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field({ nullable: true })
  @DeleteDateColumn()
  disabledAt: Date;

  @ManyToOne(() => Client, (e) => e.authPages)
  client: Client;

  @OneToOne(() => Zone)
  zone: Zone;
}
