import { IsMACAddress, IsNotEmpty, IsString } from 'class-validator';

export class CreateGuestDeviceInput {
  @IsNotEmpty()
  @IsMACAddress()
  mac: string;

  @IsNotEmpty()
  @IsString()
  userAgent: string;
}
