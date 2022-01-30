import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateUserInput {
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
  alias: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  @Field(() => String)
  email: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  phoneNumber: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sex?: number;
}
