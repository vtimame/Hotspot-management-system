import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'radpostauth' })
export class RadiusPostAuth extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  id: number;

  @Column({ type: 'text' })
  username: string;

  @Column({ type: 'text', nullable: true })
  pass?: string;

  @Column({ type: 'text', nullable: true })
  reply?: string;

  @Column({ type: 'text', nullable: true })
  CalledStationId?: string;

  @Column({ type: 'text', nullable: true })
  CallingStationId?: string;

  @Column({ type: 'timestamptz', default: 'now()' })
  authdate: Date;
}
