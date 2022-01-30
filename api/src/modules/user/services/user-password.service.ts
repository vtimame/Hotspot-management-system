import { Injectable } from '@nestjs/common';
import { UserPasswordRepository } from '../repositories/user-password.repository';
import { DeepPartial } from 'typeorm';
import { UserPassword } from '../entities/user-password';
import { hashSync, compareSync } from 'bcrypt';
import { EventService } from '../../event/services/event.service';
import { UserRepository } from '../repositories/user.repository';
import { User } from '../entities/user';

@Injectable()
export class UserPasswordService {
  constructor(
    private userRepo: UserRepository,
    private eventService: EventService,
    private userPasswordRepo: UserPasswordRepository,
  ) {}

  async create(passwordDto: DeepPartial<UserPassword>): Promise<UserPassword> {
    const user = await this.userRepo.findOne(passwordDto.userId);
    const hash = hashSync(passwordDto.value, 10);
    try {
      await this.userPasswordRepo.findByUserId(passwordDto.userId);
      await this.userPasswordRepo.update(passwordDto.userId, {
        value: hash,
      });
      return await this.userPasswordRepo.findByUserId(passwordDto.userId);
    } catch (error) {
      const newUserPasswordEntity = this.userPasswordRepo.create({
        ...passwordDto,
        value: hash,
      });

      await this.eventService.info({
        entities: { userId: user.id },
        message: `Сгенерирован временный пароль: ${passwordDto.value} для пользователя ${user?.surname} ${user?.name}`,
        context: UserPasswordService.name,
      });

      return this.userPasswordRepo.save(newUserPasswordEntity);
    }
  }

  async compare(user: User, password: string): Promise<boolean> {
    const instance = await this.userPasswordRepo.findByUserId(user.id);
    const result = compareSync(password, instance?.value);

    if (!result) {
      await this.eventService.info({
        entities: { userId: user.id },
        message: `${user?.surname} ${user?.name} ввел${
          user?.sex === 0 ? '' : 'а'
        } неверный пароль`,
        context: UserPasswordService.name,
      });
    }

    return result;
  }

  async deleteByUserId(userId: number): Promise<void> {
    await this.userPasswordRepo.delete({ userId });
  }
}
