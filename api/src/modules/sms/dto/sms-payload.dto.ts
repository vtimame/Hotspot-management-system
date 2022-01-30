import { EventEntitiesType } from '../../event/types/event-entities.type';

export class SmsPayloadDto {
  phone: string;
  message: string;
  eventEntities?: EventEntitiesType;
}
