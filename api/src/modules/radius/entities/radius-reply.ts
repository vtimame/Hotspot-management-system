import {
  BaseEntity,
  Column,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'radreply' })
export class RadiusReply extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'text', default: '' })
  UserName: string;

  @Index()
  @Column({ type: 'text', default: '' })
  Attribute: string;

  @Column({ length: 2, default: '==' })
  op: string;

  @Column({ type: 'text', default: '' })
  Value: string;
}
