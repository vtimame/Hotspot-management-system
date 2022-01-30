import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'stack_files' })
export class StackFile {
  @PrimaryGeneratedColumn()
  id: number;

  @Index()
  @Column({ type: 'varchar', unique: true })
  name: string;

  @Column({ type: 'varchar' })
  mime: string;

  @Column({ type: 'varchar' })
  folder: string;
}
