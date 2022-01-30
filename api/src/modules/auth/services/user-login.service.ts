import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from '../../user/entities/user';
import { UserPasswordService } from '../../user/services/user-password.service';
import { generateUserPassword } from '../../../common/utils';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { UserPasswordRepository } from '../../user/repositories/user-password.repository';
import { JwtService } from '@nestjs/jwt';
import { EventService } from '../../event/services/event.service';

@Injectable()
export class UserLoginService {
  constructor(
    @InjectQueue('sms') private smsQueue: Queue,
    private eventService: EventService,
    private userPasswordService: UserPasswordService,
    private userPasswordRepository: UserPasswordRepository,
    private jwtService: JwtService,
  ) {}

  async sendPassword(user: User): Promise<void> {
    const password = generateUserPassword();
    await this.userPasswordService.create({
      userId: user.id,
      value: password.toString(),
    });
    await this.smsQueue.add({
      phone: user.phoneNumber,
      message: `Ваш новый пин-код: ${password}`,
    });
  }

  async createJwt(user: User, password: string): Promise<string> {
    const passwordIsValid = await this.userPasswordService.compare(
      user,
      password,
    );

    if (!passwordIsValid) {
      throw new UnauthorizedException('Invalid password!');
    }

    await this.eventService.info({
      message: `${user.name} ${user.surname} авторизовался в системе`,
      entities: { userId: user.id },
      context: UserLoginService.name,
    });

    await this.userPasswordService.deleteByUserId(user.id);
    return this.jwtService.sign({ id: user.id, type: 'user' });
  }
}
