import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
  Subscription,
} from '@nestjs/graphql';
import { Client } from '../entities/client';
import { Inject, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { PUB_SUB } from '../../redis/redis.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
import { ClientRepository } from '../repositories/client.repository';
import { ClientService } from '../services/client.service';
import { ClientsInput } from '../inputs/clients.input';
import { ClientInput } from '../inputs/client.input';
import { CreateClientInput } from '../inputs/create-client.input';
import { UpdateClientInput } from '../inputs/update-client.input';
import { Zone } from '../../zone/entities/zone';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { JwtService } from '@nestjs/jwt';
import { LoginResponse } from '../../auth/dto/login-response.type';
import { EventService } from '../../event/services/event.service';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { User } from '../../user/entities/user';
import { ClientEmployeeRepository } from '../repositories/client-employee.repository';

const CLIENT_ADDED_EVENT = 'clientAdded';
const CLIENT_UPDATED_EVENT = 'clientUpdated';
const CLIENT_DISABLED_EVENT = 'clientDisabled';
const CLIENT_RESTORED_EVENT = 'clientRestored';

@Resolver(() => Client)
export class ClientResolver {
  constructor(
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private clientRepo: ClientRepository,
    private clientService: ClientService,
    private zoneRepo: ZoneRepository,
    private jwtService: JwtService,
    private eventService: EventService,
    private clientEmployeeRepo: ClientEmployeeRepository,
  ) {}

  @Query(() => [Client], { nullable: 'items' })
  @UseGuards(UserAuthGuard)
  async clients(
    @Args('input', { nullable: true }) input: ClientsInput,
  ): Promise<Client[]> {
    return this.clientRepo.findAll(input);
  }

  @Query(() => Client, { nullable: true })
  @UseGuards(UserAuthGuard)
  async client(
    @Args('id') id: number,
    @Args('input', { nullable: true }) input?: ClientInput,
  ): Promise<Client> {
    return this.clientRepo.findOne({ where: { id }, ...input });
  }

  @Mutation(() => Client)
  @UseGuards(UserAuthGuard)
  async createClient(
    @CurrentUser() user: User,
    @Args('input') input: CreateClientInput,
  ): Promise<Client> {
    const clientAdded = await this.clientService.create(input);
    await this.pubSub.publish(CLIENT_ADDED_EVENT, { clientAdded });

    await this.eventService.info({
      message: `${user.name} ${user.surname} создал${
        user.sex === 0 ? '' : 'а'
      } клиента ${clientAdded.name}`,
      entities: { clientId: clientAdded.id, userId: user.id },
      context: ClientResolver.name,
    });

    return clientAdded;
  }

  @Mutation(() => Client)
  @UseGuards(UserAuthGuard)
  async updateClient(
    @CurrentUser() user: User,
    @Args('id') id: number,
    @Args('input') input: UpdateClientInput,
  ): Promise<Client> {
    const clientUpdated = await this.clientService.update(id, input);
    await this.pubSub.publish(CLIENT_UPDATED_EVENT, { clientUpdated });

    await this.eventService.info({
      message: `${user.name} ${user.surname} обновил${
        user.sex === 0 ? '' : 'а'
      } клиента ${clientUpdated.name}`,
      entities: { clientId: clientUpdated.id, userId: user.id },
      context: ClientResolver.name,
    });

    return clientUpdated;
  }

  @Mutation(() => Client)
  @UseGuards(UserAuthGuard)
  async disableClient(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<Client> {
    const clientDisabled = await this.clientService.disable(id);
    await this.pubSub.publish(CLIENT_DISABLED_EVENT, { clientDisabled });
    await this.pubSub.publish(CLIENT_UPDATED_EVENT, {
      clientUpdated: clientDisabled,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} отключил${
        user.sex === 0 ? '' : 'а'
      } клиента ${clientDisabled.name}`,
      entities: { clientId: clientDisabled.id, userId: user.id },
      context: ClientResolver.name,
    });

    return clientDisabled;
  }

  @Mutation(() => Client)
  @UseGuards(UserAuthGuard)
  async restoreClient(
    @CurrentUser() user: User,
    @Args('id') id: number,
  ): Promise<Client> {
    const clientRestored = await this.clientService.restore(id);
    await this.pubSub.publish(CLIENT_RESTORED_EVENT, { clientRestored });
    await this.pubSub.publish(CLIENT_UPDATED_EVENT, {
      clientUpdated: clientRestored,
    });

    await this.eventService.info({
      message: `${user.name} ${user.surname} включил${
        user.sex === 0 ? '' : 'а'
      } клиента ${clientRestored.name}`,
      entities: { clientId: clientRestored.id, userId: user.id },
      context: ClientResolver.name,
    });

    return clientRestored;
  }

  @Mutation(() => LoginResponse)
  @UseGuards(UserAuthGuard)
  async loginAsClient(@Args('id') id: number): Promise<LoginResponse> {
    const authEntity = await this.clientEmployeeRepo.findOneOrFail(id);
    const jwt = this.jwtService.sign({ id: authEntity.id, type: 'client' });
    return { jwt, authEntity };
  }

  @Subscription(() => Client)
  @UseGuards(UserAuthGuard)
  clientAdded() {
    return this.pubSub.asyncIterator(CLIENT_ADDED_EVENT);
  }

  @Subscription(() => Client)
  @UseGuards(UserAuthGuard)
  clientUpdated() {
    return this.pubSub.asyncIterator(CLIENT_UPDATED_EVENT);
  }

  @Subscription(() => Client)
  @UseGuards(UserAuthGuard)
  clientDisabled() {
    return this.pubSub.asyncIterator(CLIENT_DISABLED_EVENT);
  }

  @Subscription(() => Client)
  @UseGuards(UserAuthGuard)
  clientRestored() {
    return this.pubSub.asyncIterator(CLIENT_RESTORED_EVENT);
  }

  @ResolveField(() => [Zone], { nullable: 'items' })
  async zones(@Parent() client: Client): Promise<Zone[]> {
    return this.zoneRepo.findByClientId(client.id);
  }
}
