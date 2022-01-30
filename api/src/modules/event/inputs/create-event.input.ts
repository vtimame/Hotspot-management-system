import {
  IsBoolean,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
} from 'class-validator';
import { EventEntitiesType } from '../types/event-entities.type';

export class CreateEventInput {
  @IsNotEmpty()
  @IsString()
  message: string;

  @IsOptional()
  @IsObject()
  entities?: EventEntitiesType;

  @IsOptional()
  @IsBoolean()
  isDebugMessage?: boolean;

  @IsOptional()
  @IsString()
  context: string;
}
