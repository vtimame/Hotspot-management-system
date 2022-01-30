import {
  BaseEntity,
  Column,
  DeleteDateColumn,
  Entity,
  Index,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { UserPassword } from './user-password';
import { UserToken } from './user-token';
import {
  Field,
  GraphQLISODateTime,
  ID,
  Int,
  ObjectType,
} from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'users' })
export class User extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  name: string;

  @Field(() => String)
  @Column({ type: 'varchar', length: 20 })
  surname: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 20, unique: true })
  alias: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 30, unique: true })
  email: string;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar', length: 10, unique: true })
  phoneNumber: string;

  @Field(() => Int)
  @Index()
  @Column({ type: 'smallint', default: 0 })
  sex: number;

  @Field(() => GraphQLISODateTime, { nullable: true })
  @DeleteDateColumn()
  disabledAt?: Date;

  @OneToOne(() => UserPassword, { nullable: true })
  password?: UserPassword;

  @OneToMany(() => UserToken, (e) => e.user, { nullable: true })
  tokens: UserToken[];
}
