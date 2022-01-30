import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';

@ObjectType()
@Entity({ name: 'radcheck', synchronize: false })
export class RadiusCheck extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', name: 'sessionid', unsigned: true })
  sessionId: number;

  @Field()
  @Index()
  @Column({ type: 'text', default: '' })
  username: string;

  @Index()
  @Column({ type: 'text', default: '' })
  attribute: string;

  @Column({ type: 'varchar', length: 2, default: '==' })
  op: string;

  @Field({ nullable: true })
  @Column({ type: 'text', default: '' })
  value: string;
}
