import {
  IsIP,
  IsMACAddress,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ManyToOne } from 'typeorm';
import { Zone } from '../../zone/entities/zone';

export class CreateGuestAttemptInput {
  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  @IsNumber()
  deviceId: number;

  @IsNotEmpty()
  @IsIP()
  ip: string;

  @IsNotEmpty()
  @IsMACAddress()
  mac: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(15)
  phoneNumber: string;

  @IsOptional()
  @IsString()
  @MaxLength(6)
  password?: string;
}
