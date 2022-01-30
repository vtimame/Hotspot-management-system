import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class UpdateClientInput {
  @IsOptional()
  @IsString()
  @MaxLength(50)
  @Field(() => String, { nullable: true })
  name?: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  password?: string;
}
