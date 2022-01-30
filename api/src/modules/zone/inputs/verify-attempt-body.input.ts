import { IsNumberString, IsOptional, MaxLength } from 'class-validator';
import { AttemptBodyInput } from './attempt-body.input';

export class VerifyAttemptBodyInput extends AttemptBodyInput {
  @IsOptional()
  @IsNumberString()
  @MaxLength(6)
  password?: string;
}
