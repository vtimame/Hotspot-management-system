import { Args, Mutation, Query, Resolver, Subscription } from '@nestjs/graphql';
import { User } from '../entities/user';
import { UserRepository } from '../repositories/user.repository';
import { UsersInput } from '../inputs/users.input';
import { CreateUserInput } from '../inputs/create-user.input';
import { UpdateUserInput } from '../inputs/update-user.input';
import { UserService } from '../services/user.service';
import { Inject, UseGuards } from '@nestjs/common';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { EventService } from '../../event/services/event.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';

const USER_ADDED_EVENT = 'userAdded';
const USER_UPDATED_EVENT = 'userUpdated';
const USER_DISABLED_EVENT = 'userDisabled';
const USER_RESTORED_EVENT = 'userRestored';

@Resolver(() => User)
@UseGuards(UserAuthGuard)
export class UserResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private userRepo: UserRepository,
    private userService: UserService,
    private eventService: EventService,
  ) {}

  @Query(() => [User], { nullable: 'items' })
  async users(
    @Args('input', { nullable: true }) input: UsersInput,
  ): Promise<User[]> {
    return this.userRepo.findAll(input);
  }

  @Mutation(() => User)
  async createUser(
    @CurrentUser() user: User,
    @Args('input') input: CreateUserInput,
  ): Promise<User> {
    const userAdded = await this.userService.create(input);
    await this.pubSub.publish(USER_ADDED_EVENT, { userAdded });

    await this.eventService.info({
      message: `${user.name} ${user.surname} создал${
        user.sex === 0 ? '' : 'а'
      } пользователя ${userAdded.name} ${userAdded.surname}`,
      entities: { userId: user.id },
      context: UserResolver.name,
    });

    return userAdded;
  }

  @Mutation(() => User)
  async updateUser(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('input') input: UpdateUserInput,
  ): Promise<User> {
    const userUpdated = await this.userService.update(id, { ...input });
    await this.pubSub.publish(USER_UPDATED_EVENT, { userUpdated });

    await this.eventService.info({
      message: `${user.name} ${user.surname} обновил${
        user.sex === 0 ? '' : 'а'
      } пользователя ${userUpdated.name} ${userUpdated.surname}`,
      entities: { userId: user.id },
      context: UserResolver.name,
    });

    return userUpdated;
  }

  @Mutation(() => User)
  async disableUser(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<User> {
    const userDisabled = await this.userService.disable(id);
    await this.pubSub.publish(USER_DISABLED_EVENT, { userDisabled });
    await this.pubSub.publish(USER_UPDATED_EVENT, {
      userUpdated: userDisabled,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} отключил${
        user.sex === 0 ? '' : 'а'
      } пользователя ${userDisabled.name} ${userDisabled.surname}`,
      entities: { userId: user.id },
      context: UserResolver.name,
    });

    return userDisabled;
  }

  @Mutation(() => User)
  async restoreUser(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<User> {
    const userRestored = await this.userService.restore(id);
    await this.pubSub.publish(USER_RESTORED_EVENT, { userRestored });
    await this.pubSub.publish(USER_UPDATED_EVENT, {
      userUpdated: userRestored,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} включил${
        user.sex === 0 ? '' : 'а'
      } пользователя ${userRestored.name} ${userRestored.surname}`,
      entities: { userId: user.id },
      context: UserResolver.name,
    });

    return userRestored;
  }

  @Subscription(() => User)
  userAdded() {
    return this.pubSub.asyncIterator(USER_ADDED_EVENT);
  }

  @Subscription(() => User)
  userUpdated() {
    return this.pubSub.asyncIterator(USER_UPDATED_EVENT);
  }

  @Subscription(() => User)
  userDisabled() {
    return this.pubSub.asyncIterator(USER_DISABLED_EVENT);
  }

  @Subscription(() => User)
  userRestored() {
    return this.pubSub.asyncIterator(USER_RESTORED_EVENT);
  }
}
