import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RedisPubSub } from 'graphql-redis-subscriptions';

export const PUB_SUB = 'PUB_SUB';

@Global()
@Module({
  providers: [
    {
      provide: PUB_SUB,
      inject: [ConfigService],
      useFactory: (c: ConfigService) =>
        new RedisPubSub({
          connection: {
            host: c.get<string>('redis.host'),
            port: c.get<number>('redis.port'),
          },
        }),
    },
  ],
  exports: [PUB_SUB],
})
export class RedisModule {}
