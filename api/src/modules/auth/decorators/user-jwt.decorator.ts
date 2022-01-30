import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const UserJwt = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const ctx = GqlExecutionContext.create(context);
    const jwt: string = ctx.getContext().req.headers['authorization'];
    return jwt?.replace('Bearer ', '') || null;
  },
);

export { UserJwt };
