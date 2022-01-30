import { IsDate, IsIP, IsNotEmpty, IsNumber } from 'class-validator';

export class CreateGuestSessionInput {
  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  @IsNumber()
  deviceId: number;

  @IsNotEmpty()
  @IsNumber()
  authId: number;

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
