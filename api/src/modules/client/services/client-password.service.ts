import { Injectable } from '@nestjs/common';
import { ClientPasswordRepository } from '../repositories/client-password.repository';
import { compareSync } from 'bcrypt';
import { ClientRepository } from '../repositories/client.repository';
import { EventService } from '../../event/services/event.service';
import { ClientEmployee } from '../entities/client-employee';
import { ClientEmployeeRepository } from '../repositories/client-employee.repository';
import { InjectSentry, SentryService } from '@ntegral/nestjs-sentry';

@Injectable()
export class ClientPasswordService {
  constructor(
    private clientPasswordRepo: ClientPasswordRepository,
    private clientRepo: ClientRepository,
    private clientEmployeeRepo: ClientEmployeeRepository,
    private eventService: EventService,
    @InjectSentry() private readonly sentry: SentryService,
  ) {}

  async create(dto: any) {
    try {
      const client = await this.clientEmployeeRepo.findOne(dto.clientId);
      const newEntity = this.clientPasswordRepo.create(dto);
      const result = await this.clientPasswordRepo.save(newEntity);

      await this.eventService.info({
        entities: { clientId: client.id },
        message: `Сгенерирован пароль для клиента ${client.surname} ${client.name}`,
        context: ClientPasswordService.name,
      });

      return result;
    } catch (error) {
      this.sentry.instance().captureException(error);
      console.log(error);
    }
  }

  async compare(client: ClientEmployee, password: string): Promise<boolean> {
    const hash = await this.clientPasswordRepo.findOne({ clientId: client.id });
    const result = compareSync(password, hash?.value);

    if (!result) {
      await this.eventService.info({
        entities: { clientId: client.id },
        message: `Клиент ${client.name} ввел неверный пароль`,
        context: ClientPasswordService.name,
      });
    }

    return result;
  }

  async deleteByClientId(clientId: number): Promise<void> {
    await this.clientPasswordRepo.delete({ clientId });
  }
}
