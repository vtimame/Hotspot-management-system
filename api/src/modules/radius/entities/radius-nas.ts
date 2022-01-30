import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'nas' })
export class RadiusNas extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  nasname: string;

  @Column({ type: 'text' })
  shortname: string;

  @Column({ type: 'text', default: 'other' })
  type: string;

  @Column({ type: 'int', nullable: true })
  ports?: number;

  @Column({ type: 'text' })
  secret: string;

  @Column({ type: 'text', nullable: true })
  server: string;

  @Column({ type: 'text', nullable: true })
  community: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
