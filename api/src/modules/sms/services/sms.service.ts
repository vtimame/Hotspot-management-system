import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SmsPayloadDto } from '../dto/sms-payload.dto';
import { createClient } from 'soap';
import { EventService } from '../../event/services/event.service';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class SmsService {
  constructor(
    private eventService: EventService,
    private configService: ConfigService,
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  async sendMessage(dto: SmsPayloadDto): Promise<void> {
    try {
      const payload = {
        message: `Отправлено sms сообщение: ${dto.message} на номер: ${dto.phone}`,
        context: SmsService.name,
      };
      await this.eventService.info(
        dto.eventEntities
          ? { ...payload, entities: dto.eventEntities }
          : payload,
      );

      if (this.configService.get<string>('app.environment') !== 'development') {
        createClient(
          this.configService.get<string>('sms.provider.host'),
          (err, client) => {
            if (err) throw err;
            client.send_sms(
              {
                login: this.configService.get<string>('sms.provider.login'),
                psw: this.configService.get<string>('sms.provider.password'),
                phones: `+7${dto.phone}`,
                mes: dto.message,
              },
              function (err, result) {
                if (err) throw err;
                console.log(Object.assign({}, dto, result.sendresult));
              },
            );
          },
        );
      }
    } catch (error) {
      this.sentry.instance().captureException(error);
      console.log(error);
    }
  }
}
