import {
  IsDate,
  IsIP,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateGuestAuthInput {
  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  @IsNumber()
  deviceId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  login: string;

  @IsNotEmpty()
  @IsIP()
  ip: string;

  @IsNotEmpty()
  @IsDate()
  startedAt: Date;

  @IsNotEmpty()
  @IsDate()
  expiresAt: Date;
}
