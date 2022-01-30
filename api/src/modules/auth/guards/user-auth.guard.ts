import {
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlExecutionContext } from '@nestjs/graphql';
import { Observable } from 'rxjs';
import { User } from '../../user/entities/user';

@Injectable()
export class UserAuthGuard extends AuthGuard('jwt') {
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
    const isUserInstance = user instanceof User;

    if (err || !user) {
      throw err || new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }

    if (!isUserInstance) {
      throw new ForbiddenException('You are not authorized to do this');
    }

    return user;
  }
}
