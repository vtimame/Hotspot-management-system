import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class UpdateClientEmployeeInput {
  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  clientId?: number;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Field(() => String, { nullable: true })
  surname?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Field(() => String, { nullable: true })
  patronymic?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @MaxLength(10)
  @Field(() => String, { nullable: true })
  phoneNumber?: string;
}
