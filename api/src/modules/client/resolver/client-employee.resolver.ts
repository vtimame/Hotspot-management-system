import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { ClientEmployee } from '../entities/client-employee';
import { ClientEmployeeRepository } from '../repositories/client-employee.repository';
import { ClientEmployeeService } from '../services/client-employee.service';
import { UseGuards } from '@nestjs/common';
import { UserAuthGuard } from '../../auth/guards/user-auth.guard';
import { ClientEmployeesInput } from '../inputs/client-employees.input';
import { CreateClientEmployeeInput } from '../inputs/create-client-employee.input';
import { UpdateClientEmployeeInput } from '../inputs/update-client-employee.input';
import { Client } from '../entities/client';
import { ClientRepository } from '../repositories/client.repository';

@Resolver(() => ClientEmployee)
export class ClientEmployeeResolver {
  constructor(
    private clientEmployeeRepo: ClientEmployeeRepository,
    private clientEmployeeService: ClientEmployeeService,
    private clientRepo: ClientRepository,
  ) {}

  @UseGuards(UserAuthGuard)
  @Query(() => [ClientEmployee], { nullable: 'items' })
  async clientEmployees(
    @Args('input') input: ClientEmployeesInput,
  ): Promise<ClientEmployee[]> {
    return this.clientEmployeeRepo.findByByClientId(input);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => ClientEmployee)
  async createClientEmployee(
    @Args('input') input: CreateClientEmployeeInput,
  ): Promise<ClientEmployee> {
    return this.clientEmployeeService.create(input);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => ClientEmployee)
  async updateClientEmployee(
    @Args('id') id: number,
    @Args('input') input: UpdateClientEmployeeInput,
  ): Promise<ClientEmployee> {
    return this.clientEmployeeService.update(id, input);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => ClientEmployee)
  async disableClientEmployee(@Args('id') id: number): Promise<ClientEmployee> {
    return this.clientEmployeeService.disable(id);
  }

  @UseGuards(UserAuthGuard)
  @Mutation(() => ClientEmployee)
  async restoreClientEmployee(@Args('id') id: number): Promise<ClientEmployee> {
    return this.clientEmployeeService.restore(id);
  }

  @ResolveField(() => Client)
  async company(@Parent() employee: ClientEmployee): Promise<Client> {
    return this.clientRepo.findOne({ id: employee.clientId });
  }
}
