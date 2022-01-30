import { Field, ObjectType } from '@nestjs/graphql';
import { AuthEntityUnion } from './auth-entity.union';

@ObjectType()
export class LoginResponse {
  @Field(() => String, { nullable: true })
  jwt?: string;

  @Field(() => AuthEntityUnion, { nullable: true })
  authEntity?: typeof AuthEntityUnion;
}
