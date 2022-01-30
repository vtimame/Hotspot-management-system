import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { AuthPage } from '../../auth-page/entities/auth-page';

@ObjectType()
export class ClientZone {
  @Field(() => ID)
  id: number;

  @Field(() => Int)
  clientId: number;

  @Field(() => Int, { nullable: true })
  authPageId?: number;

  @Field(() => String)
  name: string;

  @Field(() => String)
  interfaceName: string;

  @Field(() => [String], { nullable: 'items' })
  authTypes: string[];

  @Field(() => Int)
  authLifetime: number;

  @Field(() => Int)
  sessionLifetime: number;

  @Field(() => Int)
  sessionTimeout: number;

  @Field(() => AuthPage, { nullable: true })
  authPage?: AuthPage;
}
