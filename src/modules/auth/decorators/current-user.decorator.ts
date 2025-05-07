import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { RequestWithUser, User } from '@/utils'

export const CurrentUser = createParamDecorator(
  (_, ctx: ExecutionContext): User | null => {
    const req = ctx.switchToHttp().getRequest<RequestWithUser>()

    return req.user
      ? { id: req.user.id, role: req.user.role, email: req.user.email }
      : null
  },
)
