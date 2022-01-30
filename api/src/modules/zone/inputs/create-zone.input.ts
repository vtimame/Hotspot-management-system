import { Field, InputType, Int } from '@nestjs/graphql';
import {
  IsArray,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';

@InputType()
export class CreateZoneInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  clientId: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  authPageId?: number;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  name: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  interfaceName: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  routerIp: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  routerLogin: string;

  @IsNotEmpty()
  @IsString()
  @Field(() => String)
  routerPassword: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  authTypes?: string[];

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  authLifetime: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  sessionLifetime: number;

  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  sessionTimeout: number;
}
