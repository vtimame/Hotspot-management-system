import {
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { Client } from '../../client/entities/client';
import { ClientEmployee } from '../../client/entities/client-employee';

@Injectable()
export class ClientAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    if (context.getType() === 'http') {
      const [req] = context.getArgs();
      return req;
    }

    const ctx = GqlExecutionContext.create(context);

    return ctx.getContext().req;
  }

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    const isClientInstance = user instanceof ClientEmployee;
    if (err || !user || !isClientInstance) {
      throw err || new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    return user;
  }
}
