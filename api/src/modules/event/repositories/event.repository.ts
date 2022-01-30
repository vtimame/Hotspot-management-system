import { EntityRepository, Repository } from 'typeorm';
import { Event } from '../entities/event';
import { EventsInput } from '../inputs/events.input';

@EntityRepository(Event)
export class EventRepository extends Repository<Event> {
  async findMany(filter: EventsInput): Promise<Event[]> {
    let events = this.createQueryBuilder('event');

    if (filter?.entities) {
      events = events.where('event.entities :: jsonb @> :entities', {
        entities: filter.entities,
      });
    }

    if (filter?.withoutDebugMessages === true) {
      events = events.andWhere('event.isDebugMessage = :isDebugMessage', {
        isDebugMessage: false,
      });
    }

    return events
      .orderBy('event.createdAt', 'DESC')
      .andWhere('event.createdAt >= :from', {
        from: filter.between.createdAtFrom,
      })
      .andWhere('event.createdAt <= :to', { to: filter.between.createdAtTo })
      .getMany();
  }
}
