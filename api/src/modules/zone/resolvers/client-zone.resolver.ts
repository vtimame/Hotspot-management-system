import { Query, Resolver } from '@nestjs/graphql';
import { ClientZone } from '../entities/client-zone';
import { UseGuards } from '@nestjs/common';
import { ClientAuthGuard } from '../../auth/guards/client-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { ZoneRepository } from '../repositories/zone.repository';
import { ClientEmployee } from '../../client/entities/client-employee';

@UseGuards(ClientAuthGuard)
@Resolver(() => ClientZone)
export class ClientZoneResolver {
  constructor(private zoneRepo: ZoneRepository) {}

  @Query(() => [ClientZone], { nullable: 'items' })
  async authClientZones(
    @CurrentUser() client: ClientEmployee,
  ): Promise<ClientZone[]> {
    return this.zoneRepo.findByClientId(client.clientId);
  }
}
