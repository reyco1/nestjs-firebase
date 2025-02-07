import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { FirebaseUser } from '../interfaces/firebase-user.interface';

export const User = createParamDecorator(
  (data: keyof FirebaseUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;

    return data ? user?.[data] : user;
  },
);