import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { QueryErrorFilter } from './common/filters/query-error.filter';
import { StackService } from './modules/stack/services/stack.service';
import { SentryService } from '@ntegral/nestjs-sentry';

const bootstrap = async (): Promise<Logger> => {
  const logger = new Logger('Bootstrap');
  const app = await NestFactory.create(AppModule, {
    cors: true,
  });
  const stackService = app.get(StackService);
  const cfg = app.get(ConfigService);
  const sentry = app.get(SentryService);
  const port = cfg.get<number>('app.port');

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new QueryErrorFilter(httpAdapter));
  app.setGlobalPrefix('rest');

  await stackService.createFolderIfNotExists('storage');

  await app.listen(port, () => {
    logger.debug(`Application listening ${port} port...`);
  });

  sentry
    .instance()
    .captureMessage(
      `Application started in ${cfg.get<string>(
        'app.environment',
      )} environment`,
    );
  return logger;
};

bootstrap().then((logger) => logger.debug('Application started...'));
