import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { AuthPage } from '../entities/auth-page';
import {
  ForbiddenException,
  Inject,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthPageRepository } from '../repositories/auth-page.repository';
import { AuthPageService } from '../services/auth-page.service';
import { EventService } from '../../event/services/event.service';
import { ClientAuthGuard } from '../../auth/guards/client-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { CreateMyAuthPageInput } from '../inputs/create-my-auth-page.input';
import {
  AUTH_PAGE_ADDED_EVENT,
  AUTH_PAGE_DELETED_EVENT,
  AUTH_PAGE_UPDATED_EVENT,
} from './auth-page.resolver';
import { UpdateAuthPageInput } from '../inputs/update-auth-page.input';
import { Zone } from '../../zone/entities/zone';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { ClientZone } from '../../zone/entities/client-zone';
import { ClientEmployee } from '../../client/entities/client-employee';

@UseGuards(ClientAuthGuard)
@Resolver(() => AuthPage)
export class MyAuthPageResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private authPageRepo: AuthPageRepository,
    private authPageService: AuthPageService,
    private eventService: EventService,
    private zoneRepo: ZoneRepository,
  ) {}

  @Query(() => [AuthPage], { nullable: true })
  async myAuthPages(
    @CurrentUser() employee: ClientEmployee,
  ): Promise<AuthPage[]> {
    return this.authPageRepo.find({ clientId: employee.clientId });
  }

  @Mutation(() => AuthPage)
  async createMyAuthPage(
    @CurrentUser() employee: ClientEmployee,
    @Args('input') input: CreateMyAuthPageInput,
  ): Promise<AuthPage> {
    const authPageAdded = await this.authPageService.create({
      ...input,
      clientId: employee.clientId,
    });
    await this.pubSub.publish(AUTH_PAGE_ADDED_EVENT, { authPageAdded });
    await this.eventService.info({
      message: `Клиент создал страницу авторизации`,
      entities: {
        clientId: employee.clientId,
        zonePageId: authPageAdded.id,
      },
      context: MyAuthPageResolver.name,
    });

    return authPageAdded;
  }

  @Mutation(() => AuthPage)
  async updateMyAuthPage(
    @CurrentUser() employee: ClientEmployee,
    @Args('id') id: number,
    @Args('input') input: UpdateAuthPageInput,
  ): Promise<AuthPage> {
    const authPage = await this.authPageRepo.findOne(id);
    if (!authPage) {
      throw new NotFoundException('Auth page not found');
    } else if (authPage.clientId !== employee.clientId) {
      throw new ForbiddenException();
    }

    const authPageUpdated = await this.authPageService.update(id, input);
    await this.pubSub.publish(AUTH_PAGE_UPDATED_EVENT, { authPageUpdated });

    await this.eventService.info({
      message: 'Клиент обновил страницу авторизации',
      entities: {
        clientId: employee.clientId,
        zonePageId: authPageUpdated.id,
      },
      context: MyAuthPageResolver.name,
    });

    return authPageUpdated;
  }

  @Mutation(() => AuthPage)
  async deleteMyAuthPage(
    @CurrentUser() employee: ClientEmployee,
    @Args('id') id: number,
  ): Promise<AuthPage> {
    const authPage = await this.authPageRepo.findOne(id);
    if (!authPage) {
      throw new NotFoundException('Auth page not found');
    } else if (authPage.clientId !== employee.clientId) {
      throw new ForbiddenException();
    }

    const authPageDeleted = await this.authPageService.delete(id);
    await this.pubSub.publish(AUTH_PAGE_DELETED_EVENT, { authPageDeleted });

    await this.eventService.info({
      message: 'Клиент удалил страницу авторизации',
      entities: {
        clientId: employee.clientId,
        zonePageId: authPageDeleted.id,
      },
      context: MyAuthPageResolver.name,
    });

    return authPageDeleted;
  }

  @ResolveField(() => ClientZone, { nullable: true })
  async zone(@Parent() page: AuthPage): Promise<Zone> {
    return this.zoneRepo.findOne({ authPageId: page.id });
  }
}
