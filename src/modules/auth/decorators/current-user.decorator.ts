import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser, IUser } from '@/utils'

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): IUser | null => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>()

    return req.user
      ? { id: req.user.id, roles: req.user.roles, email: req.user.email }
      : null
  },
)
