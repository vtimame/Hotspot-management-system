import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity({ name: 'client_passwords' })
export class ClientPassword {
  @PrimaryColumn({ type: 'int', unsigned: true })
  clientId: number;

  @Column({ type: 'varchar' })
  value: string;
}
