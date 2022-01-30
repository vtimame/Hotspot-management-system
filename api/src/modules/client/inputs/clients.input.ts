import { Field, InputType } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/inputs/pagination.input';

@InputType()
export class ClientsInput extends PaginationInput {
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}
