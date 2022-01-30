import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/inputs/pagination.input';

@InputType()
export class AuthPagesInput extends PaginationInput {
  @Field(() => Boolean)
  withDeleted: boolean;
}

@InputType()
export class AuthPageFilter {
  @Field(() => Int)
  clientId: number;
}
