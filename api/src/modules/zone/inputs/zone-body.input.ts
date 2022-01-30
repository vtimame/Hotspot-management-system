import {
  IsIP,
  IsMACAddress,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsString,
  IsUrl,
  MinLength,
} from 'class-validator';

export class ZoneBodyInput {
  @IsNotEmpty()
  @IsString()
  interfaceName: string;

  @IsNotEmpty()
  @IsIP()
  ip: string;

  @IsNotEmpty()
  @IsUrl()
  linkLoginOnly: string;

  @IsNotEmpty()
  @IsMACAddress()
  mac: string;
}
