import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientPasswordService } from '../../client/services/client-password.service';
import { generateUserPassword } from '../../../common/utils';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { hashSync } from 'bcrypt';
import { EventService } from '../../event/services/event.service';
import { ClientEmployee } from '../../client/entities/client-employee';

@Injectable()
export class ClientLoginService {
  constructor(
    @InjectQueue('sms') private smsQueue: Queue,
    private clientPasswordService: ClientPasswordService,
    private jwtService: JwtService,
    private eventService: EventService,
  ) {}

  async sendPassword(client: ClientEmployee): Promise<void> {
    const password = generateUserPassword();
    await this.clientPasswordService.create({
      clientId: client.id,
      value: hashSync(password.toString(), 10),
    });

    await this.smsQueue.add({
      phone: client.phoneNumber,
      message: `Ваш новый пин-код: ${password}`,
    });
  }

  async createJwt(client: ClientEmployee, password: string): Promise<string> {
    const passwordIsValid = await this.clientPasswordService.compare(
      client,
      password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password!');
    }

    await this.eventService.info({
      message: `Клиент ${client.name} авторизовался в системе`,
      context: ClientLoginService.name,
      entities: { clientId: client.id },
    });

    await this.clientPasswordService.deleteByClientId(client.id);
    return this.jwtService.sign({ id: client.id, type: 'client' });
  }
}
