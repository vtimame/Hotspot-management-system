import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';

const UserAgent = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    let headers;
    if (context.getType() !== 'http') {
      const ctx = GqlExecutionContext.create(context);
      headers = ctx.getContext()?.req?.headers;
    } else {
      const [args] = context.getArgs();
      headers = args.headers;
    }

    if (headers) {
      return headers['user-agent'];
    }

    return null;
  },
);

export { UserAgent };
