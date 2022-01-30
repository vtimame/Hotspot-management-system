import { DynamicModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { UserPassword } from '../modules/user/entities/user-password';
import { UserToken } from '../modules/user/entities/user-token';
import { User } from '../modules/user/entities/user';
import { UserRepository } from '../modules/user/repositories/user.repository';
import { UserPasswordRepository } from '../modules/user/repositories/user-password.repository';
import { UserTokenRepository } from '../modules/user/repositories/user-token.repository';
import { Client } from '../modules/client/entities/client';
import { ClientRepository } from '../modules/client/repositories/client.repository';
import { ZoneRepository } from '../modules/zone/repositories/zone.repository';
import { Zone } from '../modules/zone/entities/zone';
import { StackFile } from '../modules/stack/entities/stack-file';
import { StackFileRepository } from '../modules/stack/repositories/stack-file.repository';
import { AuthPageRepository } from '../modules/auth-page/repositories/auth-page.repository';
import { AuthPage } from '../modules/auth-page/entities/auth-page';
import { ClientPassword } from '../modules/client/entities/client-password';
import { ClientPasswordRepository } from '../modules/client/repositories/client-password.repository';
import { GuestDevice } from '../modules/guest/entities/guest-device';
import { GuestDeviceRepository } from '../modules/guest/repositories/guest-device.repository';
import { GuestAttempt } from '../modules/guest/entities/guest-attempt';
import { GuestAttemptRepository } from '../modules/guest/repositories/guest-attempt.repository';
import { GuestAuth } from '../modules/guest/entities/guest-auth';
import { GuestSession } from '../modules/guest/entities/guest-session';
import { GuestAuthRepository } from '../modules/guest/repositories/guest-auth.repository';
import { GuestSessionRepository } from '../modules/guest/repositories/guest-session.repository';
import { RadiusCheck } from '../modules/radius/entities/radius-check';
import { RadiusCheckRepository } from '../modules/radius/repositories/radius-check.repository';
import { Event } from '../modules/event/entities/event';
import { EventRepository } from '../modules/event/repositories/event.repository';
import { GuestSessionTimeout } from '../modules/guest/entities/guest-session-timeout';
import { GuestSessionTimeoutRepository } from '../modules/guest/repositories/guest-session-timeout.repository';
import { ClientEmployee } from '../modules/client/entities/client-employee';
import { ClientEmployeeRepository } from '../modules/client/repositories/client-employee.repository';

const TypeOrmConfiguration: DynamicModule = TypeOrmModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    type: 'postgres',
    host: c.get<string>('database.host'),
    port: c.get<number>('database.port'),
    username: c.get<string>('database.username'),
    password: c.get<string>('database.password'),
    database: c.get<string>('database.name'),
    autoLoadEntities: true,
    synchronize: true,
    logging: true,
  }),
});

const Entities = [
  User,
  UserPassword,
  UserToken,
  Client,
  ClientPassword,
  Zone,
  StackFile,
  AuthPage,
  GuestDevice,
  GuestAttempt,
  GuestAuth,
  GuestSession,
  RadiusCheck,
  Event,
  GuestSessionTimeout,
  ClientEmployee,
];

const Repositories = [
  UserRepository,
  UserPasswordRepository,
  UserTokenRepository,
  ClientRepository,
  ClientPasswordRepository,
  ZoneRepository,
  StackFileRepository,
  AuthPageRepository,
  GuestDeviceRepository,
  GuestAttemptRepository,
  GuestAuthRepository,
  GuestSessionRepository,
  RadiusCheckRepository,
  EventRepository,
  GuestSessionTimeoutRepository,
  ClientEmployeeRepository,
];

const TypeOrmEntities: DynamicModule = TypeOrmModule.forFeature([
  ...Entities,
  ...Repositories,
]);

const DatabaseConfiguration = [TypeOrmConfiguration, TypeOrmEntities];

export { DatabaseConfiguration };
