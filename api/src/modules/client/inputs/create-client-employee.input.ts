import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateClientEmployeeInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  clientId: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Field(() => String)
  surname: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  @Field(() => String)
  patronymic: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50)
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(10)
  @Field(() => String)
  phoneNumber: string;
}
