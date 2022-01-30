import { Field, InputType } from '@nestjs/graphql';
import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';

@InputType()
export class CreateClientInput {
  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  @Field(() => String)
  name: string;

  @IsOptional()
  @IsString()
  @Field(() => String, { nullable: true })
  password?: string;
}
