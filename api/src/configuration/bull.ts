import { DynamicModule } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { ConfigService } from '@nestjs/config';
import { SmsProcessor } from '../modules/sms/processors/sms.processor';
import { GuestSessionProcessor } from '../modules/guest/processors/guest-session.processor';

const BullConfiguration: DynamicModule[] = [
  BullModule.forRootAsync({
    inject: [ConfigService],
    useFactory: (c: ConfigService) => ({
      redis: {
        host: c.get<string>('redis.host'),
        port: c.get<number>('redis.port'),
      },
    }),
  }),
  BullModule.registerQueue({
    name: 'sms',
  }),
  BullModule.registerQueue({
    name: 'sessions',
  }),
];

const Processors = [SmsProcessor, GuestSessionProcessor];

export { BullConfiguration, Processors };
