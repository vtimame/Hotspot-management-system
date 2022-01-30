import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

@InputType()
export class ClientEmployeesInput {
  @IsNotEmpty()
  @IsNumber()
  @Field(() => Int)
  clientId: number;

  @IsOptional()
  @IsBoolean()
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
