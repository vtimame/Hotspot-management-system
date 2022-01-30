import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'radusergroup' })
export class RadiusUserGroup extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'text', default: '' })
  UserName: string;

  @Index()
  @Column({ type: 'text', default: '' })
  GroupName: string;

  @Column({ type: 'int', default: 0 })
  priority: string;
}
