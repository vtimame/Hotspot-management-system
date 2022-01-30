import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNumber, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateUserInput {
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
  alias?: string;

  @IsOptional()
  @IsString()
  @MaxLength(30)
  @Field(() => String, { nullable: true })
  email?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  phoneNumber?: string;

  @IsOptional()
  @IsNumber()
  @Field(() => Int, { nullable: true })
  sex?: number;
}
