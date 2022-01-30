import {
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  MinLength,
} from 'class-validator';
import { ZoneBodyInput } from './zone-body.input';

export class AttemptBodyInput extends ZoneBodyInput {
  @IsNotEmpty()
  @IsNumber()
  zoneId: number;

  @IsNotEmpty()
  @IsNumberString()
  @MinLength(10)
  phoneNumber: string;
}
