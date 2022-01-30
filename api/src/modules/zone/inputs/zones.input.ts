import { Field, InputType, Int } from '@nestjs/graphql';
import { PaginationInput } from '../../../common/inputs/pagination.input';

@InputType()
export class ZonesInput extends PaginationInput {
  @Field(() => Boolean, { nullable: true })
  withDeleted?: boolean;
}

@InputType()
export class ZonesFilter {
  @Field(() => Int, { nullable: true })
  clientId?: number;
}
