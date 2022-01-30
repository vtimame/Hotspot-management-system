import { Field, InputType, Int } from '@nestjs/graphql';
import { IsArray, IsNumber, IsOptional, IsString } from 'class-validator';

@InputType()
export class UpdateZoneInput {
  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  clientId?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  authPageId?: number;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  interfaceName?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  routerIp?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  routerLogin?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  routerPassword?: string;

  @IsOptional()
  @IsArray()
  @Field(() => [String], { nullable: true })
  authTypes?: string[];

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  authLifetime?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sessionLifetime?: number;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sessionTimeout?: number;
}
