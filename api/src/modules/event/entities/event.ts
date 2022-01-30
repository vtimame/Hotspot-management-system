import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Field, ID, ObjectType } from '@nestjs/graphql';
import { EventEntitiesType } from '../types/event-entities.type';

@ObjectType()
@Entity({ name: 'events' })
export class Event extends BaseEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => String)
  @Column({ type: 'text' })
  message: string;

  @Field(() => Boolean)
  @Index()
  @Column({ type: 'bool', default: false })
  isDebugMessage: boolean;

  @Field(() => EventEntitiesType, { nullable: true })
  @Index()
  @Column({ type: 'jsonb', nullable: true })
  entities?: EventEntitiesType;

  @Field(() => String)
  @Index()
  @Column({ type: 'varchar' })
  context: string;

  @Field()
  @Index()
  @CreateDateColumn()
  createdAt?: Date;
}
