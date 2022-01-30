import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class MyStatsInput {
  @Field()
  zoneId: number;

  @Field()
  period: string;
}
