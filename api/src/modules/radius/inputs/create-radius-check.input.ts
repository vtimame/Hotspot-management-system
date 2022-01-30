import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateRadiusCheckInput {
  @IsNotEmpty()
  @IsNumber()
  sessionId: number;

  @IsOptional()
  @IsString()
  username: string;

  @IsOptional()
  @IsString()
  attribute: string;

  @IsOptional()
  @IsString()
  @MaxLength(2)
  op: string;

  @IsOptional()
  @IsString()
  value: string;
}
