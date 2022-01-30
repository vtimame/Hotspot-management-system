import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './configuration';
import { DatabaseConfiguration } from './configuration/database';
import {
  GraphqlConfiguration,
  GraphqlProviders,
  Resolvers,
} from './configuration/graphql';
import { RedisModule } from './modules/redis/redis.module';
import { JwtConfiguration } from './configuration/jwt';
import { JwtStrategy } from './modules/auth/strategies/jwt-strategy';
import { BullConfiguration, Processors } from './configuration/bull';
import { Services } from './configuration/services';
import { StackController } from './modules/stack/controllers/stack.controller';
import { ZoneController } from './modules/zone/controller/zone.controller';
import { ScheduleModule } from '@nestjs/schedule';
import { SentryConfiguration } from './configuration/sentry';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    ...DatabaseConfiguration,
    ...JwtConfiguration,
    ...BullConfiguration,
    GraphqlConfiguration,
    SentryConfiguration,
    RedisModule,
  ],
  controllers: [StackController, ZoneController],
  providers: [
    ...Resolvers,
    ...Services,
    ...GraphqlProviders,
    ...Processors,
    JwtStrategy,
  ],
})
export class AppModule {}
