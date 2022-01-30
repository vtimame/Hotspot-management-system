import { QueryFailedError } from 'typeorm';
import { BaseExceptionFilter } from '@nestjs/core';
import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Catch(QueryFailedError)
export class QueryErrorFilter extends BaseExceptionFilter {
  constructor(@InjectSentry() private readonly sentry: SentryService) {
    super();
  }

  public catch(exception: any, host: ArgumentsHost): any {
    const detail = exception.detail;
    if (typeof detail === 'string' && detail.includes('already exists')) {
      const messageStart = exception.table.split('_').join(' ') + ' with';
      throw new BadRequestException(
        exception.detail.replace('Key', messageStart),
      );
    }

    this.sentry.instance().captureException(exception);
    return super.catch(exception, host);
  }
}
