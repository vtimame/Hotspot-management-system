import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { AuthEntityUnion } from '../dto/auth-entity.union';
import { LoginResponse } from '../dto/login-response.type';
import { LoginInput } from '../dto/login.input';
import { UserRepository } from '../../user/repositories/user.repository';
import { ClientRepository } from '../../client/repositories/client.repository';
import { User } from '../../user/entities/user';
import { UserLoginService } from '../services/user-login.service';
import { ClientLoginService } from '../services/client-login.service';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../guards/user-auth.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { ClientAuthGuard } from '../guards/client-auth.guard';
import { EventService } from '../../event/services/event.service';
import { ClientEmployee } from '../../client/entities/client-employee';
import { ClientEmployeeRepository } from '../../client/repositories/client-employee.repository';

@Resolver(() => AuthEntityUnion)
export class LoginResolver {
  constructor(
    private userRepo: UserRepository,
    private clientRepo: ClientRepository,
    private clientEmployeeRepo: ClientEmployeeRepository,
    private userLoginService: UserLoginService,
    private clientLoginService: ClientLoginService,
    private eventService: EventService,
  ) {}

  @Mutation(() => LoginResponse)
  async login(@Args('input') input: LoginInput): Promise<LoginResponse> {
    let jwt;
    let authEntity;

    await this.eventService.info({
      message: `Попытка входа: ${input.login}`,
      context: LoginResolver.name,
    });

    const user = await this.userRepo.findByLogin(input.login);
    const client = await this.clientEmployeeRepo.findByLogin(input.login);

    if (!user && !client) {
      throw new UnauthorizedException('AuthEntity is not exists!');
    }

    if (user) authEntity = user;
    if (client) authEntity = client;

    if (input.password) {
      if (authEntity instanceof User) {
        jwt = await this.userLoginService.createJwt(authEntity, input.password);
      } else if (authEntity instanceof ClientEmployee) {
        jwt = await this.clientLoginService.createJwt(
          authEntity,
          input.password,
        );
      }
    } else {
      if (authEntity instanceof User) {
        await this.userLoginService.sendPassword(authEntity);
      } else if (authEntity instanceof ClientEmployee) {
        await this.clientLoginService.sendPassword(authEntity);
      }
    }

    return {
      jwt,
      authEntity,
    };
  }

  @Query(() => ClientEmployee)
  @UseGuards(ClientAuthGuard)
  async authClient(
    @CurrentUser() client: ClientEmployee,
  ): Promise<ClientEmployee> {
    return client;
  }

  @Query(() => User)
  @UseGuards(UserAuthGuard)
  async authUser(@CurrentUser() user: User): Promise<User> {
    return user;
  }
}
