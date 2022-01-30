import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  OneToOne,
  PrimaryColumn,
} from 'typeorm';
import { User } from './user';

@Entity({ name: 'user_passwords' })
export class UserPassword extends BaseEntity {
  @Index()
  @PrimaryColumn({ type: 'int', unsigned: true })
  userId: number;

  @Column({ type: 'varchar', length: 120 })
  value: string;

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
