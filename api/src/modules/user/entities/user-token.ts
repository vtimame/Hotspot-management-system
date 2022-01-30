import {
  BaseEntity,
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity({ name: 'user_tokens' })
export class UserToken extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'int', unsigned: true })
  userId: number;

  @Index()
  @Column({ type: 'varchar' })
  value: string;

  @Column({ type: 'text' })
  userAgent: string;

  @ManyToOne(() => User, (e) => e.tokens)
  user: User;
}
