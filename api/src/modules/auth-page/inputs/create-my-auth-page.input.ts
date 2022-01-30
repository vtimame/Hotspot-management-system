import { Field, InputType } from '@nestjs/graphql';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';

@InputType()
export class CreateMyAuthPageInput {
  @Field(() => String)
  @IsNotEmpty()
  @IsString()
  @MaxLength(120)
  title: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  textColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  buttonColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  buttonTextColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  backgroundColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(['top', 'bottom', 'center', 'left', 'right'])
  backgroundPosition?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  @MaxLength(7)
  termsColor?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  logoImage?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  backgroundImage?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsString()
  bannerImage?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(['cover', 'contain', 'auto'])
  @MaxLength(20)
  backgroundSize?: string;

  @Field(() => String, { nullable: true })
  @IsOptional()
  @IsEnum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y'])
  @MaxLength(20)
  backgroundRepeat?: string;
}
