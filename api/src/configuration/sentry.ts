import { DynamicModule } from '@nestjs/common';
import { SentryModule } from '@ntegral/nestjs-sentry';
import { ConfigService } from '@nestjs/config';

const SentryConfiguration: DynamicModule = SentryModule.forRootAsync({
  inject: [ConfigService],
  useFactory: (c: ConfigService) => ({
    dsn: c.get<string>('app.sentry.dsn'),
    debug: c.get<string>('app.environment') === 'development',
    environment: c.get<string>('app.environment'),
    release: null,
  }),
});

export { SentryConfiguration };
