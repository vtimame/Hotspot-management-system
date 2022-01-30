import { Args, Field, Int, ObjectType, Query, Resolver } from '@nestjs/graphql';
import { GuestSession } from '../entities/guest-session';
import { GuestSessionRepository } from '../repositories/guest-session.repository';
import { GuestSessionsInput } from '../inputs/guest-sessions.input';
import { Between, getManager } from 'typeorm';
import { ZoneRepository } from '../../zone/repositories/zone.repository';
import { UseGuards } from '@nestjs/common';
import { ClientAuthGuard } from '../../auth/guards/client-auth.guard';
import { CurrentUser } from '../../auth/decorators/current-user.decorator';
import { Client } from '../../client/entities/client';
import { MyStatsInput } from '../inputs/my-stats.input';
import * as dayjs from 'dayjs';
import { ClientEmployee } from '../../client/entities/client-employee';

@ObjectType()
export class ConnectionsStat {
  @Field()
  key: Date;

  @Field(() => Int)
  count: number;
}

@UseGuards(ClientAuthGuard)
@Resolver(() => GuestSession)
export class MyGuestSessionResolver {
  constructor(
    private guestSessionRepo: GuestSessionRepository,
    private zoneRepo: ZoneRepository,
  ) {}

  @Query(() => [GuestSession], { nullable: true })
  async myGuestSessions(
    @CurrentUser() employee: ClientEmployee,
    @Args('input') input: GuestSessionsInput,
  ): Promise<GuestSession[]> {
    console.log(input);
    await this.zoneRepo.findOneOrFail({
      where: { id: input.zoneId, clientId: employee.clientId },
    });
    return this.guestSessionRepo.find({
      relations: ['device'],
      where: {
        zoneId: input.zoneId,
        startedAt: Between(input.issuedFrom, input.issuedTo),
      },
      withDeleted: input.withDeleted,
    });
  }

  @Query(() => [ConnectionsStat], { nullable: 'items' })
  async myStatsOfConnections(
    @CurrentUser() employee: ClientEmployee,
    @Args('filter') filter: MyStatsInput,
  ): Promise<ConnectionsStat[]> {
    const manager = getManager();
    // return await manager.query(
    //   `SELECT date("startedAt"), count("startedAt") as "count" FROM "guest_sessions" GROUP BY date("startedAt") ORDER BY date("startedAt")`,
    // );
    const options = MyGuestSessionResolver.getPeriodOptions(filter.period);

    const sessions = await manager.query(
      `
            select date_trunc('${options.trunc}', "startedAt") as key, count(1) 
            from "guest_sessions" 
            where "startedAt" 
            between '${options.betweenDates.startedAtFrom.startOf(
              'day',
            )}' and '${options.betweenDates.startedAtTo.endOf(
        'day',
      )}' group by 1 order by key
            `,
    );

    return sessions;
  }

  private static getPeriodOptions(period: string) {
    const now = dayjs();
    let trunc = 'hour';
    let startedAtFrom = now;

    switch (period) {
      case 'yesterday':
        trunc = 'hour';
        startedAtFrom = now.clone().subtract(1, 'day');
        break;
      case 'week':
        trunc = 'day';
        startedAtFrom = now.clone().subtract(1, 'week');
        break;
      case 'month':
        trunc = 'day';
        startedAtFrom = now.clone().subtract(1, 'month');
        break;
      case 'year':
        trunc = 'day';
        startedAtFrom = now.clone().subtract(1, 'year');
        break;
      case 'allTime':
        trunc = 'day';
        break;
      default:
        break;
    }

    return {
      trunc,
      betweenDates: {
        startedAtFrom: startedAtFrom,
        startedAtTo: now,
      },
    };
  }
}
