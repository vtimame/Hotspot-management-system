import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/inputs/pagination.input';

@InputType()
export class UsersInput extends PaginationInput {
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
