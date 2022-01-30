import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { AuthPage } from '../entities/auth-page';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { AuthPageRepository } from '../repositories/auth-page.repository';
import { AuthPageService } from '../services/auth-page.service';
import { AuthPageFilter, AuthPagesInput } from '../inputs/auth-pages.input';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { CreateAuthPageInput } from '../inputs/create-auth-page.input';
import { EventService } from '../../event/services/event.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/entities/user';
import { Zone } from '../../zone/entities/zone';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { UpdateAuthPageInput } from '../inputs/update-auth-page.input';

export const AUTH_PAGE_ADDED_EVENT = 'authPAgeAdded';
export const AUTH_PAGE_UPDATED_EVENT = 'authPAgeUpdated';
export const AUTH_PAGE_DELETED_EVENT = 'authPAgeDeleted';
export const AUTH_PAGE_RESTORED_EVENT = 'authPAgeRestored';

@Resolver(() => AuthPage)
export class AuthPageResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private authPageRepo: AuthPageRepository,
    private authPageService: AuthPageService,
    private eventService: EventService,
    private zoneRepo: ZoneRepository,
  ) {}

  @UseGuards(UserAuthGuard)
  @Query(() => [AuthPage], { nullable: 'items' })
  async authPages(
    @Args('input', { nullable: true }) input: AuthPagesInput,
    @Args('filter') filter: AuthPageFilter,
  ): Promise<AuthPage[]> {
    return this.authPageRepo.findAll(filter, input);
  }

  @UseGuards(UserAuthGuard)
  @Query(() => AuthPage, { nullable: true })
  async authPage(@Args('id') id: number): Promise<AuthPage> {
    return this.authPageRepo.findOne(id);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => AuthPage)
  async createAuthPage(
    @CurrentUser() user: User,
    @Args('input') input: CreateAuthPageInput,
  ): Promise<AuthPage> {
    const authPageAdded = await this.authPageService.create(input);
    await this.pubSub.publish(AUTH_PAGE_ADDED_EVENT, { authPageAdded });

    await this.saveLog(user, authPageAdded, 'создал');
    return authPageAdded;
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => AuthPage)
  async updateAuthPage(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('input') input: UpdateAuthPageInput,
  ): Promise<AuthPage> {
    const authPageUpdated = await this.authPageService.update(id, input);
    await this.pubSub.publish(AUTH_PAGE_UPDATED_EVENT, { authPageUpdated });

    await this.saveLog(user, authPageUpdated, 'обновил');
    return authPageUpdated;
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => AuthPage)
  async deleteAuthPage(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<AuthPage> {
    const page = await this.authPageRepo.findOne(id);
    const authPageDeleted = await this.authPageService.delete(id);
    await this.pubSub.publish(AUTH_PAGE_DELETED_EVENT, { authPageDeleted });
    await this.pubSub.publish(AUTH_PAGE_UPDATED_EVENT, {
      authPageUpdated: authPageDeleted,
    });

    await this.saveLog(user, page, 'удалил');
    return authPageDeleted;
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => AuthPage)
  async restoreAuthPage(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<AuthPage> {
    const page = await this.authPageRepo.findOne({
      where: { id },
      withDeleted: true,
    });
    const authPageRestored = await this.authPageService.restore(id);
    await this.pubSub.publish(AUTH_PAGE_RESTORED_EVENT, { authPageRestored });
    await this.pubSub.publish(AUTH_PAGE_UPDATED_EVENT, {
      authPageUpdated: authPageRestored,
    });

    await this.saveLog(user, page, 'восстановил');
    return authPageRestored;
  }

  @UseGuards(UserAuthGuard)
  @ResolveField(() => Zone, { nullable: true })
  async zone(@Parent() page: AuthPage): Promise<Zone> {
    return this.zoneRepo.findOne({ authPageId: page.id });
  }

  @Subscription(() => AuthPage)
  authPageAdded() {
    return this.pubSub.asyncIterator(AUTH_PAGE_ADDED_EVENT);
  }

  @Subscription(() => AuthPage)
  authPageUpdated() {
    return this.pubSub.asyncIterator(AUTH_PAGE_UPDATED_EVENT);
  }

  @Subscription(() => AuthPage)
  authPageDeleted() {
    return this.pubSub.asyncIterator(AUTH_PAGE_DELETED_EVENT);
  }

  @Subscription(() => AuthPage)
  authPageRestored() {
    return this.pubSub.asyncIterator(AUTH_PAGE_RESTORED_EVENT);
  }

  private async saveLog(
    user: User,
    page: AuthPage,
    action: string,
  ): Promise<void> {
    await this.eventService.info({
      message: `${user.name} ${user.surname} ${action}${
        user.sex === 0 ? '' : 'а'
      } страницу авторизации`,
      entities: {
        clientId: page.clientId,
        zonePageId: page.id,
        userId: user.id,
      },
      context: AuthPageResolver.name,
    });
  }
}
