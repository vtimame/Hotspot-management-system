import { Field, InputType, Int } from '@nestjs/graphql';
import { IsNotEmpty, IsNumber } from 'class-validator';
import { CreateMyAuthPageInput } from './create-my-auth-page.input';

@InputType()
export class CreateAuthPageInput extends CreateMyAuthPageInput {
  @Field(() => Int)
  @IsNotEmpty()
  @IsNumber()
  clientId: number;
}
