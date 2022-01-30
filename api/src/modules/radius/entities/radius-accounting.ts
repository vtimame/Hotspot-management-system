import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'radacct' })
export class RadiusAccounting extends BaseEntity {
  @PrimaryGeneratedColumn('increment', { type: 'bigint' })
  RadAcctId: number;

  @Column({ type: 'text' })
  AcctSessionId: string;

  @Column({ type: 'text', unique: true })
  AcctUniqueId: string;

  @Column({ type: 'text', nullable: true })
  UserName?: string;

  @Column({ type: 'text', nullable: true })
  GroupName?: string;

  @Column({ type: 'text', nullable: true })
  Realm?: string;

  @Column({ type: 'inet' })
  NASIPAddress: string;

  @Column({ type: 'text', nullable: true })
  NASPortId?: string;

  @Column({ type: 'text', nullable: true })
  NASPortType?: string;

  @Column({ type: 'timestamptz', nullable: true })
  AcctStartTime?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  AcctUpdateTime?: Date;

  @Column({ type: 'timestamptz', nullable: true })
  AcctStopTime?: Date;

  @Column({ type: 'bigint', nullable: true })
  AcctInterval?: number;

  @Column({ type: 'bigint', nullable: true })
  AcctSessionTime?: number;

  @Column({ type: 'text', nullable: true })
  AcctAuthentic?: string;

  @Column({ type: 'text', nullable: true })
  ConnectInfo_start?: string;

  @Column({ type: 'text', nullable: true })
  ConnectInfo_stop?: string;

  @Column({ type: 'bigint', nullable: true })
  AcctInputOctets?: number;

  @Column({ type: 'bigint', nullable: true })
  AcctOutputOctets?: number;

  @Column({ type: 'text', nullable: true })
  CalledStationId?: string;

  @Column({ type: 'text', nullable: true })
  CallingStationId?: string;

  @Column({ type: 'text', nullable: true })
  AcctTerminateCause?: string;

  @Column({ type: 'text', nullable: true })
  ServiceType?: string;

  @Column({ type: 'text', nullable: true })
  FramedProtocol?: string;

  @Column({ type: 'inet', nullable: true })
  FramedIPAddress?: string;

  @Column({ type: 'inet', nullable: true })
  FramedIPv6Address?: string;

  @Column({ type: 'inet', nullable: true })
  FramedIPv6Prefix?: string;

  @Column({ type: 'text', nullable: true })
  FramedInterfaceId?: string;

  @Column({ type: 'inet', nullable: true })
  DelegatedIPv6Prefix?: string;
}
