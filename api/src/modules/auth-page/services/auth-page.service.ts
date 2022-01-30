import { Injectable } from '@nestjs/common';
import { AuthPageRepository } from '../repositories/auth-page.repository';
import { CreateAuthPageInput } from '../inputs/create-auth-page.input';
import { UpdateAuthPageInput } from '../inputs/update-auth-page.input';
import { AuthPage } from '../entities/auth-page';
import { checkAffected } from '../../../common/utils';
import { EventService } from '../../event/services/event.service';

@Injectable()
export class AuthPageService {
  constructor(
    private eventService: EventService,
    private authPageRepo: AuthPageRepository,
  ) {}

  async create(dto: CreateAuthPageInput): Promise<AuthPage> {
    const newAuthPageEntity = this.authPageRepo.create(dto);
    const newAuthPageEntityResult = await this.authPageRepo.save(
      newAuthPageEntity,
    );

    this.eventService.debug({
      message: `Создана новая страница авторизации`,
      context: AuthPageService.name,
      entities: { zonePageId: newAuthPageEntityResult.id },
    });

    return newAuthPageEntityResult;
  }

  async update(id: number, dto: UpdateAuthPageInput): Promise<AuthPage> {
    const { affected } = await this.authPageRepo.update(id, { ...dto });
    await checkAffected(affected, 'Auth page not found!');

    this.eventService.debug({
      message: `Обновлена страница авторизации`,
      context: AuthPageService.name,
      entities: { zonePageId: id },
    });

    return this.authPageRepo.findOne({ where: { id }, withDeleted: true });
  }

  async delete(id: number): Promise<AuthPage> {
    const authPage = await this.authPageRepo.findOne(id);
    const { affected } = await this.authPageRepo.softDelete(id);
    await checkAffected(affected, 'Auth page not found!');

    this.eventService.debug({
      message: `Удалена страница авторизации`,
      context: AuthPageService.name,
      entities: { zonePageId: id },
    });

    return authPage;
  }

  async restore(id: number): Promise<AuthPage> {
    const authPage = await this.authPageRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    const { affected } = await this.authPageRepo.restore(id);
    await checkAffected(affected, 'Auth page not found!');

    this.eventService.debug({
      message: `Восстановлена страница авторизации`,
      context: AuthPageService.name,
      entities: { zonePageId: id },
    });

    return authPage;
  }
}
